"use client";

import { useEffect, useRef } from 'react';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChartData {
  symbol: string;
  candles: Candle[];
  lastPrice: number;
  trend: 'up' | 'down' | 'sideways';
}

export default function TradingTerminal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // 交易对列表
    const symbols = [
      'EUR/USD', 'GBP/USD', 'USD/JPY',
      'AUD/USD', 'USD/CAD', 'NZD/USD',
      'BTC/USD', 'ETH/USD', 'XAU/USD'
    ];

    // 初始化9个图表的数据
    const charts: ChartData[] = symbols.map((symbol, index) => {
      const basePrice = 1000 + index * 100;
      return {
        symbol,
        candles: [],
        lastPrice: basePrice,
        trend: 'up' as 'up' | 'down' | 'sideways',
      };
    });

    // 生成单根蜡烛
    const generateCandle = (lastPrice: number, trend: 'up' | 'down' | 'sideways'): Candle => {
      let change: number;

      if (trend === 'up') {
        change = (Math.random() * 0.6 - 0.1) * 2;
      } else if (trend === 'down') {
        change = (Math.random() * 0.6 - 0.5) * 2;
      } else {
        change = (Math.random() * 0.6 - 0.3) * 2;
      }

      const open = lastPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;

      return {
        time: Date.now(),
        open,
        high,
        low,
        close,
      };
    };

    let animationId: number;
    let lastUpdateTime = Date.now();
    const updateInterval = 200; // 每200ms添加新蜡烛

    const draw = () => {
      const rect = canvas.getBoundingClientRect();

      // 清空画布 - 纯黑背景
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 更新数据
      const now = Date.now();
      if (now - lastUpdateTime >= updateInterval) {
        charts.forEach(chart => {
          // 随机改变趋势
          if (Math.random() < 0.05) {
            const trends: Array<'up' | 'down' | 'sideways'> = ['up', 'down', 'sideways'];
            chart.trend = trends[Math.floor(Math.random() * trends.length)];
          }

          const newCandle = generateCandle(chart.lastPrice, chart.trend);
          chart.candles.push(newCandle);
          chart.lastPrice = newCandle.close;

          // 限制蜡烛数量
          const maxCandles = 40;
          if (chart.candles.length > maxCandles) {
            chart.candles.shift();
          }
        });

        lastUpdateTime = now;
      }

      // 绘制3x3网格
      const gridCols = 3;
      const gridRows = 3;
      const cellWidth = rect.width / gridCols;
      const cellHeight = rect.height / gridRows;
      const padding = 2;

      charts.forEach((chart, index) => {
        const col = index % gridCols;
        const row = Math.floor(index / gridCols);
        const x = col * cellWidth;
        const y = row * cellHeight;

        drawChart(ctx, chart, x + padding, y + padding, cellWidth - padding * 2, cellHeight - padding * 2);
      });

      animationId = requestAnimationFrame(draw);
    };

    // 绘制单个K线图
    const drawChart = (
      ctx: CanvasRenderingContext2D,
      chart: ChartData,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      if (chart.candles.length === 0) return;

      // 绘制边框
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // 绘制交易对名称
      ctx.fillStyle = 'rgba(0, 255, 136, 0.9)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(chart.symbol, x + 5, y + 15);

      // 绘制当前价格和变化
      const firstPrice = chart.candles[0].close;
      const currentPrice = chart.lastPrice;
      const change = currentPrice - firstPrice;
      const changePercent = ((change / firstPrice) * 100).toFixed(2);
      const changeColor = change >= 0 ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 50, 50, 0.9)';

      ctx.fillStyle = changeColor;
      ctx.font = '10px monospace';
      ctx.fillText(`${currentPrice.toFixed(2)}`, x + 5, y + 28);
      ctx.fillText(`${change >= 0 ? '+' : ''}${changePercent}%`, x + 5, y + 40);

      // 计算价格范围
      let minPrice = Infinity;
      let maxPrice = -Infinity;
      chart.candles.forEach(candle => {
        minPrice = Math.min(minPrice, candle.low);
        maxPrice = Math.max(maxPrice, candle.high);
      });

      const priceRange = maxPrice - minPrice;
      const chartPadding = { top: 50, bottom: 10, left: 5, right: 5 };
      const chartWidth = width - chartPadding.left - chartPadding.right;
      const chartHeight = height - chartPadding.top - chartPadding.bottom;

      // 绘制网格线
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const gridY = y + chartPadding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x + chartPadding.left, gridY);
        ctx.lineTo(x + width - chartPadding.right, gridY);
        ctx.stroke();
      }

      // 绘制蜡烛
      const candleWidth = Math.max(2, chartWidth / chart.candles.length - 2);
      const candleSpacing = chartWidth / chart.candles.length;

      chart.candles.forEach((candle, index) => {
        const candleX = x + chartPadding.left + index * candleSpacing + candleSpacing / 2;

        // 计算Y坐标
        const highY = y + chartPadding.top + ((maxPrice - candle.high) / priceRange) * chartHeight;
        const lowY = y + chartPadding.top + ((maxPrice - candle.low) / priceRange) * chartHeight;
        const openY = y + chartPadding.top + ((maxPrice - candle.open) / priceRange) * chartHeight;
        const closeY = y + chartPadding.top + ((maxPrice - candle.close) / priceRange) * chartHeight;

        const isBullish = candle.close > candle.open;
        const color = isBullish ? 'rgba(0, 255, 136, 0.8)' : 'rgba(255, 50, 50, 0.8)';

        // 绘制影线
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(candleX, highY);
        ctx.lineTo(candleX, lowY);
        ctx.stroke();

        // 绘制实体
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

        if (isBullish) {
          // 阳线 - 空心
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(candleX - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        } else {
          // 阴线 - 实心
          ctx.fillStyle = color;
          ctx.fillRect(candleX - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: '#000000' }}
      />
    </div>
  );
}
