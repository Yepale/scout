import { useEffect, useCallback } from 'react';
import { useUtilityStore } from '../stores/utilityStore';
import { lightTap } from '../utils/haptics';

const COMMANDS: Record<string, () => void> = {};

export function registerCommand(phrase: string, action: () => void) {
  COMMANDS[phrase.toLowerCase().trim()] = action;
}

export function useVoiceCommands() {
  const enabled = useUtilityStore((s) => s.voiceCommands);
  const setLastCommand = useUtilityStore((s) => s.setLastVoiceCommand);
  const store = useUtilityStore.getState();

  // Register default commands
  useEffect(() => {
    registerCommand('flash on', () => store.setFlashMode('normal'));
    registerCommand('flash off', () => store.setFlashMode('off'));
    registerCommand('red light', () => store.setFlashMode('red'));
    registerCommand('green light', () => store.setFlashMode('green'));
    registerCommand('camp mode', () => store.setCampMode(true));
    registerCommand('normal mode', () => store.setCampMode(false));
    registerCommand('night mode', () => store.setNightMode(true));
    registerCommand('screen awake', () => store.setScreenAwake(true));
    registerCommand('lock screen', () => store.setScreenLocked(true));
    registerCommand('more bright', () =>
      store.setScreenBrightness(Math.min(1, (store.screenBrightness || 0.5) + 0.2))
    );
    registerCommand('less bright', () =>
      store.setScreenBrightness(Math.max(0.1, (store.screenBrightness || 0.5) - 0.2))
    );
    registerCommand('strobe', () => store.toggleStrobe());
    registerCommand('emergency', () => store.activatePreset('emergency'));
    registerCommand('start scan', () => {
      /* handled by scan screen */
    });
    registerCommand('white screen', () => store.setScreenMode('white-cold'));
  }, []);

  const processCommand = useCallback(
    (text: string) => {
      const normalized = text.toLowerCase().trim();
      for (const [phrase, action] of Object.entries(COMMANDS)) {
        if (normalized.includes(phrase)) {
          lightTap();
          setLastCommand(phrase);
          action();
          return true;
        }
      }
      return false;
    },
    [setLastCommand]
  );

  return { enabled, processCommand };
}
