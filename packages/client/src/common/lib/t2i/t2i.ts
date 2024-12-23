import { ComfyUI } from './comfyui';
import { T2IEventMap, T2IEventType } from './events';

// 定义消息接口
interface T2IMessage {
  type: string;
  data?: any;
  image?: Uint8Array;
}

// 定义进度数据接口
interface ProgressData {
  value: number;
  max: number;
  node_id?: string;
  prompt_id?: string;
}

// 定义提示词状态接口
export interface PromptState {
  promptId: string;
  status: 'pending' | 'executing' | 'completed' | 'error' | 'timeout';
  progress: number;
  currentNode?: string;
  previewUrl?: string;
  resultUrls: string[];
  error?: any;
  startTime: number;
  endTime?: number;
  timeoutId?: NodeJS.Timeout;
}

// 定义消息处理器接口
interface IMessageHandler {
  handleMessage(message: T2IMessage): void;
}

// 定义 WebSocket 事件监听器接口
interface IWebSocketEventListener {
  onMessage(message: T2IMessage): void;
}

// 消息解析器类
class MessageParser {
  static async parse(event: MessageEvent): Promise<T2IMessage> {
    if (event.data instanceof Blob) {
      if (event.data.size > 8) {
        const buffer = await event.data.slice(8).arrayBuffer();
        return {
          type: 'preview',
          image: new Uint8Array(buffer),
        };
      } else {
        const buffer = await event.data.arrayBuffer();
        const data = new Uint8Array(buffer);
        const progressData: ProgressData = {
          value: data[1]!,
          max: data[2]!,
        };
        return {
          type: 'progress',
          data: progressData,
        };
      }
    } else {
      return JSON.parse(event.data) as T2IMessage;
    }
  }
}

// WebSocket 管理类
class WebSocketManager {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private isPending: boolean = false;
  private eventListener: IWebSocketEventListener;
  private connectionEventListener?: IConnectionEventListener;
  clientId: string;
  private comfyUI: ComfyUI;

  constructor(
    comfyUI: ComfyUI,
    clientId: string,
    eventListener: IWebSocketEventListener,
    connectionEventListener?: IConnectionEventListener,
  ) {
    this.comfyUI = comfyUI;
    this.clientId = clientId;
    this.eventListener = eventListener;
    this.connectionEventListener = connectionEventListener;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isConnected || this.isPending) return resolve();

        this.isPending = true;

        this.connectionEventListener?.onConnecting?.();

        // TODO: 最好将服务都转发到自己的服务，然后再转发给comfyui
        this.ws = new WebSocket(this.comfyUI.getWebSocketUrl(this.clientId));

        this.ws.onopen = (): void => {
          this.isConnected = true;
          this.isPending = false;
          console.log('Connected to Text2Image Server');

          this.connectionEventListener?.onConnected?.();

          resolve();
        };

        this.ws.onmessage = async (event): Promise<void> => {
          try {
            const message = await MessageParser.parse(event);
            this.eventListener.onMessage(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error): void => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = (): void => {
          this.isConnected = this.isPending = false;
          console.warn('Disconnected from Text2Image Server');

          this.connectionEventListener?.onDisconnected?.();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  isWebSocketPending(): boolean {
    return this.isPending;
  }
}

// 提示词管理类
class PromptManager {
  private promptStates: Map<string, PromptState> = new Map();
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  getPromptState(promptId: string): PromptState | undefined {
    return this.promptStates.get(promptId);
  }

  setPromptState(promptId: string, state: PromptState): void {
    this.promptStates.set(promptId, state);
  }

  getExecutingPromptIds(): string[] {
    const executingPromptIds: string[] = [];
    for (const [promptId, state] of this.promptStates.entries()) {
      if (state.status === 'executing') {
        executingPromptIds.push(promptId);
      }
    }
    return executingPromptIds;
  }

  notify<K extends T2IEventType>(eventType: K, data: T2IEventMap[K]): void {
    this.eventEmitter.emit(eventType, data);
  }
}

// 消息处理器注册表
class MessageHandlerRegistry {
  private handlers: Map<string, IMessageHandler> = new Map();

  registerHandler(messageType: string, handler: IMessageHandler): void {
    this.handlers.set(messageType, handler);
  }

  getHandler(messageType: string): IMessageHandler | undefined {
    return this.handlers.get(messageType);
  }
}

// 预览消息处理器
class PreviewMessageHandler implements IMessageHandler {
  private promptManager: PromptManager;

  constructor(promptManager: PromptManager) {
    this.promptManager = promptManager;
  }

  handleMessage(message: T2IMessage): void {
    if (message.image) {
      const blob = new Blob([message.image], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      for (const promptId of this.promptManager.getExecutingPromptIds()) {
        const state = this.promptManager.getPromptState(promptId);
        if (state && state.status !== 'error' && state.status !== 'timeout') {
          state.previewUrl = imageUrl;
          this.promptManager.notify(T2IEventType.Preview, {
            promptId,
            imageUrl,
          });
          this.promptManager.notify(T2IEventType.PromptStateChange, {
            promptId,
            state,
          });
        }
      }
    }
  }
}

// 进度消息处理器
class ProgressMessageHandler implements IMessageHandler {
  private promptManager: PromptManager;

  constructor(promptManager: PromptManager) {
    this.promptManager = promptManager;
  }

  handleMessage(message: T2IMessage): void {
    const progressData: ProgressData = message.data;
    const promptId = progressData.prompt_id;

    if (promptId) {
      const state = this.promptManager.getPromptState(promptId);
      if (state && state.status !== 'error' && state.status !== 'timeout') {
        const progress = (progressData.value / progressData.max) * 100;
        state.progress = progress;
        this.promptManager.notify(T2IEventType.Progress, {
          promptId,
          value: progressData.value,
          max: progressData.max,
        });
        this.promptManager.notify(T2IEventType.PromptStateChange, {
          promptId,
          state,
        });
      }
    }
  }
}

// 执行消息处理器
class ExecutingMessageHandler implements IMessageHandler {
  private promptManager: PromptManager;
  private comfyUI: ComfyUI;

  constructor(promptManager: PromptManager, comfyUI: ComfyUI) {
    this.promptManager = promptManager;
    this.comfyUI = comfyUI;
  }

  handleMessage(message: T2IMessage): void {
    const executingData = message.data;
    const promptId = executingData.prompt_id;

    if (promptId) {
      const state = this.promptManager.getPromptState(promptId);
      if (state && state.status !== 'error' && state.status !== 'timeout') {
        if (executingData.node === null) {
          if (state.timeoutId) {
            clearTimeout(state.timeoutId);
            delete state.timeoutId;
          }

          state.status = 'completed';
          state.endTime = Date.now();

          this.comfyUI
            .getExecutionResult(promptId)
            .then((resultUrls) => {
              state.resultUrls = resultUrls;
              this.promptManager.notify(T2IEventType.PromptStateChange, {
                promptId,
                state,
              });
              this.promptManager.notify(T2IEventType.ExecutionComplete, {
                promptId,
              });
            })
            .catch((error) => {
              state.status = 'error';
              state.error = error;
              state.endTime = Date.now();
              this.promptManager.notify(T2IEventType.PromptStateChange, {
                promptId,
                state,
              });
            });
        } else {
          state.status = 'executing';
          state.currentNode = executingData.node;
          this.promptManager.notify(T2IEventType.PromptStateChange, {
            promptId,
            state,
          });
        }
      }
    }
  }
}

// 错误消息处理器
class ErrorMessageHandler implements IMessageHandler {
  private promptManager: PromptManager;

  constructor(promptManager: PromptManager) {
    this.promptManager = promptManager;
  }

  handleMessage(message: T2IMessage): void {
    for (const promptId of this.promptManager.getExecutingPromptIds()) {
      const state = this.promptManager.getPromptState(promptId);
      if (state) {
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
          delete state.timeoutId;
        }

        state.status = 'error';
        state.error = message.data;
        state.endTime = Date.now();
        this.promptManager.notify(T2IEventType.PromptStateChange, {
          promptId,
          state,
        });
      }
    }

    this.promptManager.notify(T2IEventType.Error, message.data);
  }
}

interface IConnectionEventListener {
  onConnected(): void;
  onDisconnected(): void;
  onConnecting(): void;
}

// 改进的 EventEmitter 类
class EventEmitter {
  private eventHandlers: Map<T2IEventType, ((data: any) => void)[]> = new Map();

  on<K extends T2IEventType>(
    eventType: K,
    handler: (data: T2IEventMap[K]) => void,
  ): this {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
    return this;
  }

  off<K extends T2IEventType>(
    eventType: K,
    handler: (data: T2IEventMap[K]) => void,
  ): this {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return this;
  }

  emit<K extends T2IEventType>(eventType: K, data: T2IEventMap[K]): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

// 主客户端类
export class T2I
  extends EventEmitter
  implements IWebSocketEventListener, IConnectionEventListener
{
  private webSocketManager: WebSocketManager;
  private messageHandlerRegistry: MessageHandlerRegistry;
  private promptManager: PromptManager;
  private comfyUI: ComfyUI;
  private readonly defaultTimeout = 60000 * 3;

  constructor(url: string, clientId: string) {
    super();
    this.comfyUI = new ComfyUI(url);
    this.promptManager = new PromptManager(this);
    this.messageHandlerRegistry = new MessageHandlerRegistry();
    this.webSocketManager = new WebSocketManager(
      this.comfyUI,
      clientId,
      this,
      this,
    );

    this.registerMessageHandlers();
  }

  // 实现连接事件监听器的方法
  onConnected(): void {
    this.emit(T2IEventType.Connected, null);
  }

  onDisconnected(): void {
    this.emit(T2IEventType.Disconnected, null);
  }

  onConnecting(): void {
    this.emit(T2IEventType.Connecting, null);
  }

  private registerMessageHandlers(): void {
    this.messageHandlerRegistry.registerHandler(
      'preview',
      new PreviewMessageHandler(this.promptManager),
    );
    this.messageHandlerRegistry.registerHandler(
      'progress',
      new ProgressMessageHandler(this.promptManager),
    );
    this.messageHandlerRegistry.registerHandler(
      'executing',
      new ExecutingMessageHandler(this.promptManager, this.comfyUI),
    );
    this.messageHandlerRegistry.registerHandler(
      'error',
      new ErrorMessageHandler(this.promptManager),
    );
  }

  onMessage(message: T2IMessage): void {
    if (message.type === 'crystools.monitor') return;

    const handler = this.messageHandlerRegistry.getHandler(message.type);
    if (handler) {
      handler.handleMessage(message);
    }
  }

  connect(): Promise<void> {
    return this.webSocketManager.connect();
  }

  disconnect(): void {
    this.webSocketManager.disconnect();
  }

  isConnectedToServer(): boolean {
    return this.webSocketManager.isConnectedToServer();
  }

  isWebSocketPending(): boolean {
    return this.webSocketManager.isWebSocketPending();
  }

  async prompt({
    prompt,
    timeout = this.defaultTimeout,
    batchSize = 1,
  }: {
    prompt: string;
    timeout?: number;
    batchSize?: number;
  }): Promise<string> {
    const data = await this.comfyUI.sendPrompt(
      this.webSocketManager.clientId,
      prompt,
      batchSize,
    );
    const promptId = data.prompt_id;

    const promptState: PromptState = {
      promptId,
      status: 'pending',
      progress: 0,
      resultUrls: [],
      startTime: Date.now(),
    };

    this.promptManager.setPromptState(promptId, promptState);

    const handleTimeout = (state: PromptState): void => {
      state.status = 'timeout';
      state.error = 'Prompt timed out';
      state.endTime = Date.now();
      delete state.timeoutId;
      this.emit(T2IEventType.PromptTimeout, promptId);
      this.promptManager.notify(T2IEventType.PromptStateChange, {
        promptId,
        state,
      });
    };

    const createTimeoutCheck = (): NodeJS.Timeout => {
      return setTimeout(() => {
        const state = this.promptManager.getPromptState(promptId);
        if (
          !state ||
          state.status === 'completed' ||
          state.status === 'error'
        ) {
          return;
        }

        const otherExecutingPrompts = this.promptManager
          .getExecutingPromptIds()
          .filter((id) => id !== promptId);

        if (otherExecutingPrompts.length > 0) {
          // 如果有其他正在执行的任务，重新设置定时器
          state.timeoutId = createTimeoutCheck();
        } else {
          // 如果没有其他执行中的任务，则执行超时处理
          handleTimeout(state);
        }
      }, timeout);
    };

    promptState.timeoutId = createTimeoutCheck();

    return promptId;
  }

  getPromptState(promptId: string): PromptState | undefined {
    return this.promptManager.getPromptState(promptId);
  }
}
