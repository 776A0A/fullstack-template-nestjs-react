import { loadPrompt } from './load-prompt';

export class ComfyUI {
  constructor(private baseUrl: string) {}

  getWebSocketUrl(clientId: string): string {
    return `ws://${this.baseUrl}/ws?clientId=${clientId}`;
  }

  getHttpUrl(): string {
    return `http://${this.baseUrl}`;
  }

  async getExecutionResult(promptId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.getHttpUrl()}/history/${promptId}`);
      const history = await response.json();
      const outputs = history[promptId].outputs;
      const resultUrls: string[] = [];

      for (const nodeId in outputs) {
        const nodeOutput = outputs[nodeId];
        if (nodeOutput.images) {
          for (const image of nodeOutput.images) {
            const imageResponse = await fetch(
              `${this.getHttpUrl()}/view?` +
                `filename=${image.filename}&` +
                `subfolder=${image.subfolder}&` +
                `type=${image.type}`,
            );
            const blob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(blob);
            resultUrls.push(imageUrl);
          }
        }
      }

      return resultUrls;
    } catch (error) {
      console.error('Failed to get execution result:', error);
      throw error;
    }
  }

  async sendPrompt(
    clientId: string,
    prompt: string,
    batchSize: number = 1,
  ): Promise<{ prompt_id: string }> {
    const response = await fetch(`${this.getHttpUrl()}/prompt`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        prompt: loadPrompt(prompt, batchSize),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send prompt to Text2Image Server');
    }

    return response.json();
  }
}
