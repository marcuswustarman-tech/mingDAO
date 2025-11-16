"use client";

import { useEffect, useRef } from 'react';
import TradingTerminal from './TradingTerminal';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartStyle = 'default' | 'ink' | 'pixel' | 'river';

interface CandlestickChartProps {
  style?: ChartStyle;
}

export default function CandlestickChart({ style = 'default' }: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 如果是 river 风格，不需要绘制 canvas
    if (style === 'river') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Style configurations
    const styleConfig = {
      default: {
        // Current style - professional trading chart
        gridColor: 'rgba(200, 200, 200, 0.3)',
        gridLineWidth: 1,
        bullishColor: { body: 'rgba(0, 0, 0, 1)', wick: 'rgba(0, 0, 0, 1)' },
        bearishColor: { body: 'rgba(0, 0, 0, 1)', wick: 'rgba(0, 0, 0, 1)' },
        weakColor: { body: 'rgba(180, 180, 180, 1)', wick: 'rgba(180, 180, 180, 1)' },
        emaColor: 'rgba(180, 180, 180, 1)',
        emaLineWidth: 4,
        askColor: 'rgba(239, 68, 68, 0.6)',
        bidColor: 'rgba(34, 197, 94, 0.6)',
        candleWidth: 10,
        enableAntiAlias: true,
        backgroundAlpha: 1,
      },
      ink: {
        // Ink wash painting style - 水墨风
        gridColor: 'rgba(0, 0, 0, 0.05)',
        gridLineWidth: 0.5,
        bullishColor: { body: 'rgba(0, 0, 0, 0.15)', wick: 'rgba(0, 0, 0, 0.4)' },
        bearishColor: { body: 'rgba(0, 0, 0, 0.8)', wick: 'rgba(0, 0, 0, 0.9)' },
        weakColor: { body: 'rgba(0, 0, 0, 0.25)', wick: 'rgba(0, 0, 0, 0.35)' },
        emaColor: 'rgba(0, 0, 0, 0.2)',
        emaLineWidth: 3,
        askColor: 'rgba(0, 0, 0, 0.15)',
        bidColor: 'rgba(0, 0, 0, 0.15)',
        candleWidth: 10,
        enableAntiAlias: true,
        backgroundAlpha: 0.02,
      },
      pixel: {
        // 8-bit pixel arcade style - 像素风
        gridColor: 'rgba(100, 255, 100, 0.2)',
        gridLineWidth: 1,
        bullishColor: { body: 'rgba(0, 255, 0, 1)', wick: 'rgba(0, 255, 0, 1)' },
        bearishColor: { body: 'rgba(255, 0, 0, 1)', wick: 'rgba(255, 0, 0, 1)' },
        weakColor: { body: 'rgba(255, 255, 0, 1)', wick: 'rgba(255, 255, 0, 1)' },
        emaColor: 'rgba(0, 255, 255, 1)',
        emaLineWidth: 2,
        askColor: 'rgba(255, 100, 100, 0.8)',
        bidColor: 'rgba(100, 255, 100, 0.8)',
        candleWidth: 12,
        enableAntiAlias: false,
        backgroundAlpha: 0.1,
      },
    };

    const currentStyle = styleConfig[style as Exclude<ChartStyle, 'river'>];

    // Set canvas size
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Disable anti-aliasing for pixel style
      if (!currentStyle.enableAntiAlias) {
        ctx.imageSmoothingEnabled = false;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Update trend state
    const updateTrend = () => {
      trendDuration++;

      // Check if we should change trend
      const shouldChangeTrend =
        trendDuration >= maxTrendDuration ||
        (trendDuration >= minTrendDuration && Math.random() < 0.15);

      if (shouldChangeTrend) {
        const trends: Array<'up' | 'down' | 'sideways'> = ['up', 'down', 'sideways'];
        const otherTrends = trends.filter(t => t !== currentTrend);
        currentTrend = otherTrends[Math.floor(Math.random() * otherTrends.length)];
        trendDuration = 0;
      }
    };

    // Generate a single candle with trend
    const generateCandle = (previousClose: number): Candle => {
      const time = Date.now();
      const open = previousClose;

      // Update trend state
      updateTrend();

      // 10-15% chance to generate a large candle (大阳线/大阴线)
      const isLargeCandle = Math.random() < 0.12;

      let changePercent;

      // Calculate change based on trend
      if (currentTrend === 'up') {
        // Uptrend: 70% bullish, 30% bearish
        const isBullish = Math.random() < 0.7;
        if (isLargeCandle) {
          changePercent = isBullish ? Math.random() * 0.06 : -Math.random() * 0.03;
        } else {
          changePercent = isBullish ? Math.random() * 0.025 : -Math.random() * 0.015;
        }
      } else if (currentTrend === 'down') {
        // Downtrend: 70% bearish, 30% bullish
        const isBearish = Math.random() < 0.7;
        if (isLargeCandle) {
          changePercent = isBearish ? -Math.random() * 0.06 : Math.random() * 0.03;
        } else {
          changePercent = isBearish ? -Math.random() * 0.025 : Math.random() * 0.015;
        }
      } else {
        // Sideways: 50/50 with smaller moves
        if (isLargeCandle) {
          changePercent = (Math.random() - 0.5) * 0.05;
        } else {
          changePercent = (Math.random() - 0.5) * 0.02;
        }
      }

      const close = open * (1 + changePercent);

      // Random wick length: 0% to 0.8% (shorter and more varied)
      const upperWickPercent = Math.random() * 0.008;
      const lowerWickPercent = Math.random() * 0.008;

      const high = Math.max(open, close) * (1 + upperWickPercent);
      const low = Math.min(open, close) * (1 - lowerWickPercent);

      // Generate volume (random between 5000 and 50000, larger for big candles)
      const baseVolume = isLargeCandle ? 30000 : 15000;
      const volumeVariance = isLargeCandle ? 20000 : 10000;
      const volume = baseVolume + Math.random() * volumeVariance;

      return { time, open, high, low, close, volume };
    };

    // Calculate EMA
    const calculateEMA = (data: number[], period: number): number[] => {
      const k = 2 / (period + 1);
      const emaData: number[] = [];
      emaData[0] = data[0];

      for (let i = 1; i < data.length; i++) {
        emaData[i] = data[i] * k + emaData[i - 1] * (1 - k);
      }

      return emaData;
    };

    // Calculate CCI (Commodity Channel Index)
    const calculateCCI = (candles: Candle[], period: number): number[] => {
      const cciData: number[] = [];

      for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) {
          cciData[i] = 0;
          continue;
        }

        // Calculate Typical Price for the period
        const typicalPrices: number[] = [];
        for (let j = i - period + 1; j <= i; j++) {
          const tp = (candles[j].high + candles[j].low + candles[j].close) / 3;
          typicalPrices.push(tp);
        }

        // Calculate SMA of Typical Price
        const smaTP = typicalPrices.reduce((a, b) => a + b, 0) / period;

        // Calculate Mean Deviation
        let meanDeviation = 0;
        for (let j = 0; j < typicalPrices.length; j++) {
          meanDeviation += Math.abs(typicalPrices[j] - smaTP);
        }
        meanDeviation /= period;

        // Calculate CCI
        const currentTP = (candles[i].high + candles[i].low + candles[i].close) / 3;
        if (meanDeviation !== 0) {
          cciData[i] = (currentTP - smaTP) / (0.015 * meanDeviation);
        } else {
          cciData[i] = 0;
        }
      }

      return cciData;
    };

    // Get candle color based on style and CCI
    const getCandleColor = (cci1: number, cci2: number, isBullish: boolean): { body: string; wick: string; hollow: boolean } => {
      // For ink and pixel styles, use simple bullish/bearish logic
      if (style === 'ink' || style === 'pixel') {
        return {
          body: isBullish ? currentStyle.bullishColor.body : currentStyle.bearishColor.body,
          wick: isBullish ? currentStyle.bullishColor.wick : currentStyle.bearishColor.wick,
          hollow: style === 'ink' ? isBullish : false // Ink style uses hollow for bullish
        };
      }

      // Default style uses CCI indicator logic
      if (cci1 >= 0 && cci2 >= 0) {
        return {
          body: isBullish ? currentStyle.bullishColor.body : currentStyle.bearishColor.body,
          wick: isBullish ? currentStyle.bullishColor.wick : currentStyle.bearishColor.wick,
          hollow: true
        };
      } else if (cci1 < 0 && cci2 >= 0) {
        return {
          body: currentStyle.weakColor.body,
          wick: currentStyle.weakColor.wick,
          hollow: isBullish
        };
      } else if (cci1 < 0 && cci2 < 0) {
        return {
          body: isBullish ? currentStyle.bullishColor.body : currentStyle.bearishColor.body,
          wick: isBullish ? currentStyle.bullishColor.wick : currentStyle.bearishColor.wick,
          hollow: false
        };
      } else {
        return {
          body: currentStyle.weakColor.body,
          wick: currentStyle.weakColor.wick,
          hollow: isBullish
        };
      }
    };

    // Calculate Simple Moving Average (SMA)
    const calculateSMA = (data: number[], period: number): number[] => {
      const smaData: number[] = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          smaData[i] = data[i]; // Not enough data yet
        } else {
          const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          smaData[i] = sum / period;
        }
      }
      return smaData;
    };

    // Calculate ATR (Average True Range)
    const calculateATR = (candles: Candle[], period: number): number[] => {
      const atrData: number[] = [];
      const trueRanges: number[] = [];

      for (let i = 0; i < candles.length; i++) {
        if (i === 0) {
          trueRanges[i] = candles[i].high - candles[i].low;
        } else {
          const tr1 = candles[i].high - candles[i].low;
          const tr2 = Math.abs(candles[i].high - candles[i - 1].close);
          const tr3 = Math.abs(candles[i].low - candles[i - 1].close);
          trueRanges[i] = Math.max(tr1, tr2, tr3);
        }
      }

      // Calculate ATR using SMA of true ranges
      for (let i = 0; i < trueRanges.length; i++) {
        if (i < period - 1) {
          atrData[i] = trueRanges[i];
        } else {
          const sum = trueRanges.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          atrData[i] = sum / period;
        }
      }

      return atrData;
    };

    // Calculate Keltner Channel
    const calculateKeltnerChannel = (candles: Candle[], period: number, atrMultiplier: number): { middle: number[], upper: number[], lower: number[] } => {
      const closes = candles.map(c => c.close);
      const middle = calculateSMA(closes, period);
      const atr = calculateATR(candles, period);

      const upper = middle.map((m, i) => m + atr[i] * atrMultiplier);
      const lower = middle.map((m, i) => m - atr[i] * atrMultiplier);

      return { middle, upper, lower };
    };

    // Calculate ZigZag indicator
    const calculateZigZag = (candles: Candle[], depth: number): Array<{ index: number; price: number; type: 'high' | 'low' }> => {
      if (candles.length < depth) return [];

      const zigzagPoints: Array<{ index: number; price: number; type: 'high' | 'low' }> = [];
      let lastHighIndex = 0;
      let lastLowIndex = 0;
      let lastHigh = candles[0].high;
      let lastLow = candles[0].low;
      let searchingForHigh = true;

      for (let i = 0; i < candles.length; i++) {
        if (searchingForHigh) {
          if (candles[i].high > lastHigh) {
            lastHigh = candles[i].high;
            lastHighIndex = i;
          }
          // Check if we found a significant low
          if (lastHigh - candles[i].low >= depth * 0.01) {
            zigzagPoints.push({ index: lastHighIndex, price: lastHigh, type: 'high' });
            lastLow = candles[i].low;
            lastLowIndex = i;
            searchingForHigh = false;
          }
        } else {
          if (candles[i].low < lastLow) {
            lastLow = candles[i].low;
            lastLowIndex = i;
          }
          // Check if we found a significant high
          if (candles[i].high - lastLow >= depth * 0.01) {
            zigzagPoints.push({ index: lastLowIndex, price: lastLow, type: 'low' });
            lastHigh = candles[i].high;
            lastHighIndex = i;
            searchingForHigh = true;
          }
        }
      }

      return zigzagPoints;
    };

    // Initialize
    let candles: Candle[] = [];
    let lastPrice = 1000;
    let currentBidPrice = lastPrice - 0.3; // Bid price (买价) = lower
    let currentAskPrice = lastPrice + 0.3; // Ask price (卖价) = higher
    const candleWidth = currentStyle.candleWidth;
    const candleSpacing = candleWidth + 4;

    // Trend state management
    let currentTrend: 'up' | 'down' | 'sideways' = 'up';
    let trendDuration = 0;
    const minTrendDuration = 8; // Minimum candles before trend can change
    const maxTrendDuration = 25; // Maximum candles before trend must change

    let animationId: number;
    let lastCandleTime = Date.now();
    const candleInterval = 150;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Clear canvas with proper dimensions
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new candle
      const now = Date.now();
      if (now - lastCandleTime >= candleInterval) {
        const newCandle = generateCandle(lastPrice);
        candles.push(newCandle);
        lastPrice = newCandle.close;
        const spread = 0.3 + Math.random() * 0.4;
        currentBidPrice = lastPrice - spread / 2; // Bid = lower than mid price
        currentAskPrice = lastPrice + spread / 2; // Ask = higher than mid price
        lastCandleTime = now;
      }

      // Reserve space on the right to see new candles appearing (subtract 5 candles worth of space)
      const maxCandles = Math.floor(rect.width / candleSpacing) - 5;
      if (candles.length > maxCandles) {
        candles.shift();
      }

      if (candles.length === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Calculate price range
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      candles.forEach(candle => {
        minPrice = Math.min(minPrice, candle.low);
        maxPrice = Math.max(maxPrice, candle.high);
      });

      minPrice = Math.min(minPrice, currentAskPrice - 5);
      maxPrice = Math.max(maxPrice, currentBidPrice + 5);

      const priceRange = maxPrice - minPrice;
      const padding = { top: 0, bottom: 0, left: 0, right: 0 };

      // For ink/pixel styles, use full height for main chart (no sub chart)
      const mainChartHeight = (style === 'ink' || style === 'pixel') ? rect.height : (rect.height * 3) / 4;
      const subChartHeight = (style === 'ink' || style === 'pixel') ? 0 : rect.height / 4;
      const subChartTop = mainChartHeight;

      // Calculate CCI for NS indicator (只在 default 模式下计算)
      const cci1 = (style === 'default' && candles.length >= 7) ? calculateCCI(candles, 7) : [];
      const cci2 = (style === 'default' && candles.length >= 49) ? calculateCCI(candles, 49) : [];

      // Calculate EMA for sub chart (只在 default 模式下计算)
      const closes = candles.map(c => c.close);
      const ema12 = (style === 'default' && candles.length >= 12) ? calculateEMA(closes, 12) : [];
      const ema26 = (style === 'default' && candles.length >= 26) ? calculateEMA(closes, 26) : [];

      // Detect Golden Cross and Death Cross
      const crosses: Array<{ index: number; type: 'golden' | 'death' }> = [];
      for (let i = 1; i < candles.length; i++) {
        if (ema12[i] && ema26[i] && ema12[i - 1] && ema26[i - 1]) {
          // Golden Cross: EMA12 crosses above EMA26
          if (ema12[i - 1] <= ema26[i - 1] && ema12[i] > ema26[i]) {
            crosses.push({ index: i, type: 'golden' });
          }
          // Death Cross: EMA12 crosses below EMA26
          if (ema12[i - 1] >= ema26[i - 1] && ema12[i] < ema26[i]) {
            crosses.push({ index: i, type: 'death' });
          }
        }
      }

      // ===== MAIN CHART (2/3 top) =====

      // Draw vertical grid lines (main chart)
      ctx.strokeStyle = currentStyle.gridColor;
      ctx.lineWidth = currentStyle.gridLineWidth;
      for (let i = 0; i < candles.length; i += 10) {
        const x = i * candleSpacing + candleWidth / 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mainChartHeight);
        ctx.stroke();
      }

      // Draw horizontal grid lines (main chart)
      for (let i = 0; i <= 6; i++) {
        const y = padding.top + (mainChartHeight / 6) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Draw candles with NS indicator colors
      candles.forEach((candle, index) => {
        const x = index * candleSpacing + candleWidth / 2;

        const highY = padding.top + ((maxPrice - candle.high) / priceRange) * mainChartHeight;
        const lowY = padding.top + ((maxPrice - candle.low) / priceRange) * mainChartHeight;
        const openY = padding.top + ((maxPrice - candle.open) / priceRange) * mainChartHeight;
        const closeY = padding.top + ((maxPrice - candle.close) / priceRange) * mainChartHeight;
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

        // Determine if bullish (阳线) or bearish (阴线)
        const isBullish = candle.close > candle.open;

        // Get CCI-based color for this candle
        const currentCCI1 = cci1[index] || 0;
        const currentCCI2 = cci2[index] || 0;
        const candleColor = getCandleColor(currentCCI1, currentCCI2, isBullish);

        // Draw wick with style-specific line width
        ctx.strokeStyle = candleColor.wick;
        ctx.lineWidth = style === 'pixel' ? 3 : style === 'ink' ? 1 : 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw body with style-specific rendering
        if (candleColor.hollow) {
          // Hollow candle (空心)
          // First fill with background color to hide the wick
          const bgColor = style === 'ink'
            ? 'rgba(255, 255, 255, 0.9)' // Slightly transparent for ink style
            : style === 'pixel'
            ? 'rgba(0, 0, 0, 1)' // Black for pixel style
            : 'rgba(255, 255, 255, 1)'; // White for default
          ctx.fillStyle = bgColor;
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
          // Then draw the border
          ctx.strokeStyle = candleColor.body;
          ctx.lineWidth = style === 'pixel' ? 3 : 2;
          ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        } else {
          // Filled candle (实心)
          ctx.fillStyle = candleColor.body;
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
      });

      // 对于 ink 和 pixel 风格，跳过后续复杂指标的绘制
      // 但不要提前 return，要继续到 requestAnimationFrame
      if (style !== 'default') {
        // 简化风格不绘制价格线、EMA、sub chart
        animationId = requestAnimationFrame(draw);
        return;
      }

      // ===== 以下内容仅在 default 风格时绘制 =====

      // Draw ask price line (卖价 - red, higher price)
      const askY = padding.top + ((maxPrice - currentAskPrice) / priceRange) * mainChartHeight;
      ctx.strokeStyle = currentStyle.askColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, askY);
      ctx.lineTo(rect.width, askY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw bid price line (买价 - green, lower price)
      const bidY = padding.top + ((maxPrice - currentBidPrice) / priceRange) * mainChartHeight;
      ctx.strokeStyle = currentStyle.bidColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, bidY);
      ctx.lineTo(rect.width, bidY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw EMA20 line
      if (candles.length >= 20) {
        const closes = candles.map(c => c.close);
        const ema20 = calculateEMA(closes, 20);

        ctx.strokeStyle = currentStyle.emaColor;
        ctx.lineWidth = currentStyle.emaLineWidth;
        ctx.beginPath();
        ema20.forEach((value, index) => {
          const x = index * candleSpacing + candleWidth / 2;
          const y = padding.top + ((maxPrice - value) / priceRange) * mainChartHeight;
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      }

      // Keltner Channel removed per user request

      // ===== SUB CHART (1/3 bottom) - Golden/Death Cross =====

      // Draw separator line (lighter and thinner)
      ctx.strokeStyle = currentStyle.gridColor;
      ctx.lineWidth = currentStyle.gridLineWidth;
      ctx.beginPath();
      ctx.moveTo(0, subChartTop);
      ctx.lineTo(rect.width, subChartTop);
      ctx.stroke();

      // Draw sub chart background
      ctx.fillStyle = `rgba(245, 245, 245, ${currentStyle.backgroundAlpha})`;
      ctx.fillRect(0, subChartTop, rect.width, subChartHeight);

      // Draw sub chart grid lines
      ctx.strokeStyle = currentStyle.gridColor;
      ctx.lineWidth = currentStyle.gridLineWidth;
      for (let i = 0; i <= 3; i++) {
        const y = subChartTop + (subChartHeight / 3) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Calculate EMA value range for sub chart
      if (ema12.length > 0 && ema26.length > 0) {
        const allEmaValues = [...ema12, ...ema26].filter(v => v > 0);
        let minEma = Math.min(...allEmaValues);
        let maxEma = Math.max(...allEmaValues);
        const emaRange = maxEma - minEma;
        const emaPadding = emaRange * 0.1; // 10% padding
        minEma -= emaPadding;
        maxEma += emaPadding;
        const emaValueRange = maxEma - minEma;

        // Draw zero axis line (horizontal dashed line)
        const zeroLineY = subChartTop + subChartHeight / 2; // Middle of sub chart
        ctx.strokeStyle = currentStyle.gridColor;
        ctx.lineWidth = currentStyle.gridLineWidth;
        ctx.setLineDash([5, 5]); // Dashed line
        ctx.beginPath();
        ctx.moveTo(0, zeroLineY);
        ctx.lineTo(rect.width, zeroLineY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Draw EMA12 line (fast line)
        ctx.strokeStyle = currentStyle.emaColor;
        ctx.lineWidth = Math.max(1, currentStyle.emaLineWidth - 2);
        ctx.beginPath();
        ema12.forEach((value, index) => {
          if (value > 0) {
            const x = index * candleSpacing + candleWidth / 2;
            const y = subChartTop + ((maxEma - value) / emaValueRange) * subChartHeight;
            if (index === 0 || ema12[index - 1] <= 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        });
        ctx.stroke();

        // Draw EMA26 line (slow line)
        const ema26Alpha = (style as ChartStyle) === 'ink' ? '0.5' : '1';
        ctx.strokeStyle = (style as ChartStyle) === 'ink' ? `rgba(0, 0, 0, ${ema26Alpha})` : currentStyle.emaColor;
        ctx.lineWidth = currentStyle.emaLineWidth;
        ctx.beginPath();
        ema26.forEach((value, index) => {
          if (value > 0) {
            const x = index * candleSpacing + candleWidth / 2;
            const y = subChartTop + ((maxEma - value) / emaValueRange) * subChartHeight;
            if (index === 0 || ema26[index - 1] <= 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        });
        ctx.stroke();

        // Mark Golden Cross and Death Cross
        crosses.forEach(cross => {
          const x = cross.index * candleSpacing + candleWidth / 2;
          const ema12Value = ema12[cross.index];
          const y = subChartTop + ((maxEma - ema12Value) / emaValueRange) * subChartHeight;

          if (cross.type === 'golden') {
            // Golden Cross (做多) - hollow white circle with black border + black up arrow
            ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White fill
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Black border
            ctx.lineWidth = 2;
            ctx.stroke();

            // Black up arrow
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y - 15);
            ctx.lineTo(x, y - 8);
            ctx.moveTo(x, y - 15);
            ctx.lineTo(x - 3, y - 12);
            ctx.moveTo(x, y - 15);
            ctx.lineTo(x + 3, y - 12);
            ctx.stroke();
          } else {
            // Death Cross (做空) - solid black circle + black down arrow
            ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Black fill
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Black down arrow
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x, y + 8);
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x - 3, y + 12);
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x + 3, y + 12);
            ctx.stroke();
          }
        });

        // Draw labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '11px Arial';
        ctx.fillText('EMA12/26', 10, subChartTop + 15);
      }

      // ZigZag indicator removed per user request

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [style]);

  // 如果是 river 风格，渲染交易终端（9个K线图）
  if (style === 'river') {
    return <TradingTerminal />;
  }

  return (
    <div className="w-full h-full">
      {/* K-line chart with 3D tilt and floating animation */}
      <div
        className="w-full h-full animate-float-3d"
        style={{
          transform: 'perspective(800px) rotateX(5deg) rotateY(-3deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
      </div>

      <style jsx>{`
        @keyframes float-3d {
          0%, 100% {
            transform: perspective(800px) rotateX(5deg) rotateY(-3deg) translateZ(0px) translateY(0px);
          }
          25% {
            transform: perspective(800px) rotateX(4deg) rotateY(-2deg) translateZ(8px) translateY(-3px);
          }
          50% {
            transform: perspective(800px) rotateX(6deg) rotateY(-4deg) translateZ(12px) translateY(2px);
          }
          75% {
            transform: perspective(800px) rotateX(5deg) rotateY(-2.5deg) translateZ(6px) translateY(-2px);
          }
        }

        .animate-float-3d {
          animation: float-3d 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
