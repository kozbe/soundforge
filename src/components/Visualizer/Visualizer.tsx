import { useEffect, useRef } from 'react';
import { getAnalyser } from '../../audio/audioEngine';
import styles from './Visualizer.module.css';

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    function resize() {
      if (!canvas || !container || !ctx) return;
      canvas.width = container.clientWidth * 2;
      canvas.height = container.clientHeight * 2;
      ctx.scale(2, 2);
    }

    resize();

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width / 2;
      const H = canvas.height / 2;
      ctx.clearRect(0, 0, W, H);

      const analyser = getAnalyser();
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        const barW = W / data.length;

        ctx.fillStyle = 'rgba(255,107,61,0.08)';
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < data.length; i++) {
          const v = data[i] / 255;
          const h = v * H;

          const gradient = ctx.createLinearGradient(0, H - h, 0, H);
          gradient.addColorStop(0, `rgba(255,107,61,${0.6 * v})`);
          gradient.addColorStop(1, 'rgba(255,107,61,0.05)');

          ctx.fillStyle = gradient;
          ctx.fillRect(i * barW, H - h, barW - 1, h);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      if (!ctx) return;
      ctx.resetTransform();
      resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.visualizer} ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
