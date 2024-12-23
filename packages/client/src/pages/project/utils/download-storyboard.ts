import { promptApi } from '@/api/prompt';
import { storyboardApi } from '@/api/storyboard';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export async function downloadStoryboard(projectId: string): Promise<void> {
  try {
    const spokenVersion =
      await storyboardApi.getSpokenVersionByProjectId(projectId);
    if (!spokenVersion) {
      throw new Error('未找到分镜数据');
    }

    // 创建一个新的 ZIP 实例
    const zip = new JSZip();

    // 下载角色表
    if (spokenVersion.characters?.length) {
      const charactersWs = XLSX.utils.json_to_sheet(
        spokenVersion.characters.map((char) => ({
          编号: char.no,
          角色名称: char.name,
          外观描述: char.appearance,
        })),
      );
      const charactersWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(charactersWb, charactersWs, '角色表');
      const characterBuffer = XLSX.write(charactersWb, { type: 'array' });
      zip.file('角色表.xlsx', characterBuffer);

      // 下载角色图片
      const imagesFolder = zip.folder('角色图片');
      for (const char of spokenVersion.characters) {
        if (char.appearanceUrl) {
          try {
            const response = await fetch(char.appearanceUrl);
            const blob = await response.blob();
            imagesFolder?.file(`${char.name}.png`, blob);
          } catch (error) {
            console.error(`下载角色图片失败: ${char.name}`, error);
          }
        }
      }
    }

    // 下载分镜表
    if (spokenVersion.storyboards?.length) {
      const storyboardsWs = XLSX.utils.json_to_sheet(
        spokenVersion.storyboards.map((board) => ({
          编号: board.no,
          镜头类型: board.cameraShot,
          场景描述: board.description,
          环境: board.environment,
          旁白: board.voiceover,
          角色: spokenVersion.characters
            ?.filter((char) =>
              spokenVersion.characterStoryboards.some(
                (cs) =>
                  cs.storyboardId === board.id && cs.characterId === char.id,
              ),
            )
            .map((char) => char.name)
            .join(', '),
        })),
      );
      const storyboardsWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(storyboardsWb, storyboardsWs, '分镜表');
      const storyboardBuffer = XLSX.write(storyboardsWb, { type: 'array' });
      zip.file('分镜表.xlsx', storyboardBuffer);

      // 下载分镜图片
      const storyboardImagesFolder = zip.folder('分镜图片');
      const prompts = await promptApi.getPromptsBySpokenId(spokenVersion.id);

      for (const prompt of prompts) {
        if (prompt.promptImages?.length) {
          for (const image of prompt.promptImages) {
            try {
              const response = await fetch(image.url);
              const blob = await response.blob();
              storyboardImagesFolder?.file(
                `${prompt.no}-${image.no}.png`,
                blob,
              );
            } catch (error) {
              console.error(
                `下载分镜图片失败: ${prompt.no}-${image.no}`,
                error,
              );
            }
          }
        }
      }
    }

    // 生成并下载 ZIP 文件
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${spokenVersion.title}-分镜数据.zip`);
  } catch (error) {
    console.error('下载失败:', error);
    throw error;
  }
}
