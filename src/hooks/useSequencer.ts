import { useCallback, useEffect, useRef, useState } from 'react';
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
  bpmRef: React.MutableRefObject<number>;
  swingRef: React.MutableRefObject<number>;
  currentKeyRef: React.MutableRefObject<number>;
  currentScaleRef: React.MutableRefObject<string>;
}

export function useSequencer({
  gridRef,
  mutedRef,
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
  const isPlayingRef = useRef(false);
  const uiTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const getStepTime = useCallback((step: number) => {
    const beatTime = 60.0 / bpmRef.current / 4;
    const swingAmount = swingRef.current / 100;
    if (step % 2 === 1) {
      return beatTime * (1 + swingAmount * 0.5);
    }
    return beatTime * (1 - swingAmount * 0.25);
  }, [bpmRef, swingRef]);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      currentStepRef.current = (currentStepRef.current + 1) % STEPS;
      const step = currentStepRef.current;

      instruments.forEach((inst) => {
        if (gridRef.current[inst.id][step] && !mutedRef.current[inst.id]) {
          playInstrument(
            inst.id,
            nextNoteTimeRef.current,
            step,
            currentKeyRef.current,
            currentScaleRef.current,
          );
        }
      });

      const scheduledTime = nextNoteTimeRef.current;
      const timeoutId = setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentStep(step);
        }
      }, (scheduledTime - ctx.currentTime) * 1000);
      uiTimeoutsRef.current.add(timeoutId);

      nextNoteTimeRef.current += getStepTime(currentStepRef.current);
    }

    timerRef.current = setTimeout(scheduler, 25);
  }, [gridRef, mutedRef, currentKeyRef, currentScaleRef, getStepTime]);

  const start = useCallback(() => {
    initAudio();
    resumeAudioContext();
    const ctx = getAudioContext();
    if (!ctx) return;
    currentStepRef.current = -1;
    nextNoteTimeRef.current = ctx.currentTime;
    isPlayingRef.current = true;
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
              if (gridRef.current[inst.id][step] && !mutedRef.current[inst.id]) {
                playInstrument(
                  inst.id,
                  nextNoteTimeRef.current,
                  step,
                  currentKeyRef.current,
                  currentScaleRef.current,
                );
              }
            });

            const scheduledTime = nextNoteTimeRef.current;
            const timeoutId = setTimeout(() => {
              if (isPlayingRef.current) {
                setCurrentStep(step);
              }
            }, (scheduledTime - ctx.currentTime) * 1000);
            uiTimeoutsRef.current.add(timeoutId);

            nextNoteTimeRef.current += getStepTime(currentStepRef.current);
          }
          timerRef.current = setTimeout(doSchedule, 25);
        };
        doSchedule();
      }
    };
    runScheduler();
  }, [gridRef, mutedRef, currentKeyRef, currentScaleRef, getStepTime]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentStep(-1);
    currentStepRef.current = -1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Clear all pending UI update timeouts
    uiTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    uiTimeoutsRef.current.clear();
  }, []);

  const toggle = useCallback(() => {
    if (timerRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const timeouts = uiTimeoutsRef.current;
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  return { isPlaying, currentStep, start, stop, toggle };
}
