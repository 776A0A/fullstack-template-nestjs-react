import { PromptState } from './t2i';

// 定义事件类型枚举
export enum T2IEventType {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Preview = 'preview',
  Progress = 'progress',
  PromptStateChange = 'prompt_state_change',
  ExecutionComplete = 'execution_complete',
  Error = 'error',
  PromptTimeout = 'prompt_timeout',
}

// 为每种事件定义具体的数据类型
export interface T2IEventMap {
  [T2IEventType.Connected]: null;
  [T2IEventType.Disconnected]: null;
  [T2IEventType.Connecting]: null;
  [T2IEventType.Preview]: {
    promptId: string;
    imageUrl: string;
  };
  [T2IEventType.Progress]: {
    promptId: string;
    value: number;
    max: number;
  };
  [T2IEventType.PromptStateChange]: {
    promptId: string;
    state: PromptState;
  };
  [T2IEventType.ExecutionComplete]: {
    promptId: string;
  };
  [T2IEventType.Error]: any;
  [T2IEventType.PromptTimeout]: string;
}

// 定义类型安全的事件处理器类型
export type T2IEventHandler<T extends T2IEventType> = (
  data: T2IEventMap[T],
) => void;
