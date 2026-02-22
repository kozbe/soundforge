import { useCallback, useRef, useState } from 'react';
import {
  initAudio,
  getAudioContext,
  playInstrument,
  resumeAudioContext,
} from '../audio/audioEngine';
import { instruments, STEPS } from '../data/instruments';

interface UseSequencerProps {
  gridRef: React.MutableRefObject<Record<string, boolean[]>>;
  mutedRef: React.MutableRefObject<Record<string, boolean>>;
  volumesRef: React.MutableRefObject<Record<string, number>>;
  bpmRef: React.MutableRefObject<number>;
  swingRef: React.MutableRefObject<number>;
  currentKeyRef: React.MutableRefObject<number>;
  currentScaleRef: React.MutableRefObject<string>;
}

export function useSequencer({
  gridRef,
  mutedRef,
  volumesRef,
  bpmRef,
  swingRef,
  currentKeyRef,
  currentScaleRef,
}: UseSequencerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(-1);

  const getStepTime = useCallback(
    (step: number) => {
      const beatTime = 60.0 / bpmRef.current / 4;
      const swingAmount = swingRef.current / 100;
      if (step % 2 === 1) {
        return beatTime * (1 + swingAmount * 0.5);
      }
      return beatTime * (1 - swingAmount * 0.25);
    },
    [bpmRef, swingRef],
  );

  const start = useCallback(() => {
    initAudio();
    resumeAudioContext();
    const ctx = getAudioContext();
    if (!ctx) return;
    currentStepRef.current = -1;
    nextNoteTimeRef.current = ctx.currentTime;
    setIsPlaying(true);
    setCurrentStep(-1);

    // Start scheduler in next tick so state is set
    const runScheduler = () => {
      if (!timerRef.current) {
        // inline scheduler start
        const doSchedule = () => {
          while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
            currentStepRef.current = (currentStepRef.current + 1) % STEPS;
            const step = currentStepRef.current;

            instruments.forEach((inst) => {
              if (
                gridRef.current[inst.id][step] &&
                !mutedRef.current[inst.id]
              ) {
                playInstrument(
                  inst.id,
                  nextNoteTimeRef.current,
                  step,
                  currentKeyRef.current,
                  currentScaleRef.current,
                  volumesRef.current[inst.id],
                );
              }
            });

            const scheduledTime = nextNoteTimeRef.current;
            setTimeout(
              () => {
                setCurrentStep(step);
              },
              (scheduledTime - ctx.currentTime) * 1000,
            );

            nextNoteTimeRef.current += getStepTime(currentStepRef.current);
          }
          timerRef.current = setTimeout(doSchedule, 25);
        };
        doSchedule();
      }
    };
    runScheduler();
  }, [gridRef, mutedRef, volumesRef, currentKeyRef, currentScaleRef, getStepTime]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    currentStepRef.current = -1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (timerRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  return { isPlaying, currentStep, start, stop, toggle };
}
