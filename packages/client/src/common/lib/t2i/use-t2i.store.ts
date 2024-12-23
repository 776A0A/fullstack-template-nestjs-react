import { randomStr } from '@/common/utils';
import { useUserStore } from '@/store';
import { create } from 'zustand';
import { T2IEventType, type T2IEventHandler } from './events';
import { T2I, type PromptState } from './t2i';

interface T2iState {
  connect: () => Promise<void>;
  disconnect: () => void;
  prompt: (params: { prompt: string; timeout?: number }) => Promise<string>;
  getPromptState: (promptId: string) => PromptState | undefined;
  on: <T extends T2IEventType>(
    eventType: T,
    handler: T2IEventHandler<T>,
  ) => void;
  off: <T extends T2IEventType>(
    eventType: T,
    handler: T2IEventHandler<T>,
  ) => void;
  isConnectedToServer: boolean;
  isWebSocketPending: boolean;
}

export const useT2iStore = create<T2iState>((set) => {
  const { user } = useUserStore.getState();
  const t2i = new T2I(
    import.meta.env.VITE_T2I_SERVER_URL,
    user?.id || randomStr(),
  );

  t2i
    .on(T2IEventType.Connecting, () => {
      set({ isWebSocketPending: true });
    })
    .on(T2IEventType.Connected, () => {
      set({ isConnectedToServer: true, isWebSocketPending: false });
    })
    .on(T2IEventType.Disconnected, () => {
      set({ isConnectedToServer: false, isWebSocketPending: false });
    });

  return {
    connect: async (): Promise<void> => {
      await t2i.connect();
    },
    disconnect: (): void => {
      t2i.disconnect();
    },
    prompt: async ({
      prompt,
      timeout,
    }: {
      prompt: string;
      timeout?: number;
    }): Promise<string> => {
      return await t2i.prompt({ prompt, timeout });
    },
    getPromptState: (promptId: string): PromptState | undefined => {
      return t2i.getPromptState(promptId);
    },
    on: <T extends T2IEventType>(
      eventType: T,
      handler: T2IEventHandler<T>,
    ): void => {
      t2i.on(eventType, handler);
    },
    off: <T extends T2IEventType>(
      eventType: T,
      handler: T2IEventHandler<T>,
    ): void => {
      t2i.off(eventType, handler);
    },
    isConnectedToServer: false,
    isWebSocketPending: false,
  };
});
