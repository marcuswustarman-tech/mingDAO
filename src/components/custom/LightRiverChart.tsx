"use client";

import { useEffect, useRef } from 'react';

interface LightLine {
  y: number; // 当前Y位置
  baseY: number; // 基准Y位置
  color: string;
  speed: number;
  amplitude: number; // 波动幅度
  frequency: number; // 波动频率
  phase: number; // 相位
  brightness: number; // 亮度
  pulseTime: number; // 脉冲时间
  pulseStrength: number; // 脉冲强度
}

export default function LightRiverChart() {
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

    // 光线颜色方案
    const colors = {
      green: 'rgba(0, 255, 136, 0.8)', // 霓虹绿
      blue: 'rgba(0, 229, 255, 0.8)', // 电光蓝
      purple: 'rgba(200, 0, 255, 0.8)', // 洋红紫
    };

    // 初始化光线
    const numLines = 60; // 光线数量
    const lines: LightLine[] = [];
    const rect = canvas.getBoundingClientRect();

    for (let i = 0; i < numLines; i++) {
      const baseY = (i / numLines) * rect.height;
      const colorKeys = ['green', 'blue', 'purple'];
      const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];

      lines.push({
        y: baseY,
        baseY: baseY,
        color: randomColor,
        speed: 0.5 + Math.random() * 1.5,
        amplitude: 2 + Math.random() * 8,
        frequency: 0.001 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.6 + Math.random() * 0.4,
        pulseTime: 0,
        pulseStrength: 0,
      });
    }

    let animationId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    // 鼠标交互
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // 随机触发脉冲
    const triggerRandomPulse = () => {
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      randomLine.pulseTime = Date.now();
      randomLine.pulseStrength = 20 + Math.random() * 40;

      // 涟漪效应 - 影响相邻光线
      const index = lines.indexOf(randomLine);
      if (index > 0) {
        lines[index - 1].pulseStrength = randomLine.pulseStrength * 0.3;
        lines[index - 1].pulseTime = Date.now();
      }
      if (index < lines.length - 1) {
        lines[index + 1].pulseStrength = randomLine.pulseStrength * 0.3;
        lines[index + 1].pulseTime = Date.now();
      }
    };

    // 定期触发脉冲
    const pulseInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30%概率触发
        triggerRandomPulse();
      }
    }, 500);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();

      // 清空画布 - 使用半透明黑色实现拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      time += 1;

      lines.forEach((line, index) => {
        // 计算波动
        const baseWave = Math.sin(time * line.frequency + line.phase) * line.amplitude;

        // 计算脉冲效果
        let pulse = 0;
        if (line.pulseTime > 0) {
          const elapsed = Date.now() - line.pulseTime;
          const pulseDuration = 1000; // 1秒
          if (elapsed < pulseDuration) {
            const progress = elapsed / pulseDuration;
            // 使用easeOut效果
            pulse = line.pulseStrength * (1 - progress) * Math.sin(progress * Math.PI);
          } else {
            line.pulseTime = 0;
            line.pulseStrength = 0;
          }
        }

        // 鼠标影响 - 引力/斥力效果
        let mouseInfluence = 0;
        if (mouseX > 0 && mouseY > 0) {
          const distanceToMouse = Math.abs(line.baseY - mouseY);
          if (distanceToMouse < 100) {
            const influence = (100 - distanceToMouse) / 100;
            mouseInfluence = (mouseY - line.baseY) * influence * 0.3;
          }
        }

        // 最终Y位置
        line.y = line.baseY + baseWave + pulse + mouseInfluence;

        // 绘制光线
        const numPoints = Math.floor(rect.width / 3); // 光线由点组成
        ctx.strokeStyle = line.color;

        // 脉冲时增强亮度
        const glowIntensity = pulse > 0 ? 2 : 1;
        const lineWidth = 1.5 + (pulse > 0 ? 1 : 0);

        // 辉光效果
        ctx.shadowBlur = 8 * glowIntensity * line.brightness;
        ctx.shadowColor = line.color;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = line.brightness;

        ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
          const x = rect.width - (i * 3) + (time * line.speed) % rect.width;
          const offsetY = Math.sin((x + time) * 0.01) * 2; // 微小的水平波动
          const y = line.y + offsetY;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // 如果超出左边界，从右边重新开始
          if (x < 0) {
            break;
          }
        }
        ctx.stroke();

        // 重置阴影
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
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
