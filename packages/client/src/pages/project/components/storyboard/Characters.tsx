import { storyboardApi } from '@/api/storyboard';
import {
  CopyIconButton,
  EmptyUIBase,
  ErrorRetryBoundary,
} from '@/common/components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui';
import { useImageViewer } from '@/common/hooks';
import { T2iGenerator } from '@/common/lib/t2i';
import { CharacterResponse, UpdateCharacterRequest } from '@oxygen-admin/shared/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import IconAccountPlus from '~icons/mdi/account-plus';
import { EditableCell } from './EditableCell';

interface CharactersProps {
  spokenId: string;
  characters?: CharacterResponse[];
}

interface EditingEntry {
  characterId: string;
  field: string;
  value: string;
}

export function Characters({ spokenId, characters }: CharactersProps) {
  const queryClient = useQueryClient();
  const { openImageDialog } = useImageViewer();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [editingEntries, setEditingEntries] = useState<EditingEntry[]>([]);

  const {
    mutate: createCharacters,
    isPending,
    error,
    reset,
    isError,
  } = useMutation({
    mutationFn: () => storyboardApi.createCharacters(spokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spokenVersion'] });
    },
  });

  const { mutate: updateAppearanceUrl } = useMutation({
    mutationFn: ({ characterId, url }: { characterId: string; url: string }) =>
      storyboardApi.updateCharacterAppearanceUrl(characterId, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spokenVersion'] });
    },
  });

  const { mutate: updateCharacter } = useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: string;
      data: UpdateCharacterRequest;
    }) => storyboardApi.updateCharacter(spokenId, characterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spokenVersion'] });
    },
  });

  const getFormattedData = () => {
    return JSON.stringify(
      characters?.map((char) => ({
        no: char.no,
        character: char.name,
        appearance: char.appearance,
      })) ?? [],
      null,
      2,
    );
  };

  const getAllImages = () => {
    return (
      characters
        ?.filter((char) => char.appearanceUrl)
        .map((char) => ({
          url: char.appearanceUrl!,
          title: char.name,
          alt: char.appearance,
        })) ?? []
    );
  };

  const getCharacterImageIndex = (characterId: string) => {
    return (
      characters
        ?.filter((char) => char.appearanceUrl)
        .findIndex((char) => char.id === characterId) ?? 0
    );
  };

  const renderT2iGenerator = (character: CharacterResponse) => (
    <div className="relative">
      <T2iGenerator
        prompt={character.appearance}
        existingImageUrl={character.appearanceUrl}
        onImageGenerated={(url) =>
          updateAppearanceUrl({
            characterId: character.id,
            url,
          })
        }
        onImageClick={() => {
          const images = getAllImages();
          const index = getCharacterImageIndex(character.id);
          openImageDialog({ images, initialIndex: index });
        }}
      />
    </div>
  );

  const handleEditClick = (characterId: string, field: string) => {
    const existingEntry = editingEntries.find(
      (entry) => entry.characterId === characterId && entry.field === field,
    );
    if (existingEntry) return;

    setEditingEntries((prev) => [
      ...prev,
      {
        characterId,
        field,
        value:
          field === 'name'
            ? characters?.find((c) => c.id === characterId)?.name || ''
            : characters?.find((c) => c.id === characterId)?.appearance || '',
      },
    ]);
  };

  const handleConfirm = async (
    characterId: string,
    field: string,
    newValue: string,
  ) => {
    await updateCharacter({ characterId, data: { [field]: newValue } });

    setEditingEntries((prev) =>
      prev.filter((e) => !(e.characterId === characterId && e.field === field)),
    );
  };

  const handleCancel = (characterId: string, field: string) => {
    setEditingEntries((prev) =>
      prev.filter((e) => !(e.characterId === characterId && e.field === field)),
    );
  };

  const handleChange = (characterId: string, field: string, value: string) => {
    setEditingEntries((prev) => {
      const newEntries = prev.map((e) => {
        if (e.characterId === characterId && e.field === field) {
          return { ...e, value };
        }
        return e;
      });
      return newEntries;
    });
  };

  const renderDesktopView = (character: CharacterResponse) => (
    <>
      <TableRow>
        <TableCell
          className="font-medium text-sm text-center border-r border-border"
          rowSpan={2}
        >
          {character.no}
        </TableCell>
        <TableCell className="font-medium text-sm text-center text-muted-foreground border-r border-border relative">
          <EditableCell
            itemId={character.id}
            field="name"
            value={
              editingEntries.find(
                (e) => e.characterId === character.id && e.field === 'name',
              )?.value || character.name
            }
            isEditing={
              !!editingEntries.find(
                (e) => e.characterId === character.id && e.field === 'name',
              )
            }
            onEdit={handleEditClick}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onChange={handleChange}
          />
        </TableCell>
        {!isMobile && (
          <TableCell className="p-2 text-center" rowSpan={2}>
            {renderT2iGenerator(character)}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell className="whitespace-pre-wrap text-sm text-muted-foreground border-r border-border relative">
          <EditableCell
            position="right-bottom"
            itemId={character.id}
            field="appearance"
            isEditing={
              !!editingEntries.find(
                (e) =>
                  e.characterId === character.id && e.field === 'appearance',
              )
            }
            value={
              editingEntries.find(
                (e) =>
                  e.characterId === character.id && e.field === 'appearance',
              )?.value || character.appearance
            }
            onEdit={handleEditClick}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onChange={handleChange}
          />
        </TableCell>
      </TableRow>
    </>
  );

  const renderMobileView = (character: CharacterResponse) => (
    <>
      <TableRow>
        <TableCell
          className="font-medium text-sm text-center border-r border-border"
          rowSpan={3}
        >
          {character.no}
        </TableCell>
        <TableCell className="font-medium text-sm text-center text-muted-foreground border-r border-border relative">
          <EditableCell
            itemId={character.id}
            field="name"
            isEditing={
              !!editingEntries.find(
                (e) => e.characterId === character.id && e.field === 'name',
              )
            }
            value={
              editingEntries.find(
                (e) => e.characterId === character.id && e.field === 'name',
              )?.value || character.name
            }
            onEdit={handleEditClick}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onChange={handleChange}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="whitespace-pre-wrap text-sm text-muted-foreground border-r border-border relative">
          <EditableCell
            position="right-bottom"
            itemId={character.id}
            field="appearance"
            isEditing={
              !!editingEntries.find(
                (e) =>
                  e.characterId === character.id && e.field === 'appearance',
              )
            }
            value={
              editingEntries.find(
                (e) =>
                  e.characterId === character.id && e.field === 'appearance',
              )?.value || character.appearance
            }
            onEdit={handleEditClick}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onChange={handleChange}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="p-2">{renderT2iGenerator(character)}</TableCell>
      </TableRow>
    </>
  );

  if (!characters?.length) {
    return (
      <EmptyUIBase>
        {isError ? (
          <ErrorRetryBoundary
            retry={() => {
              reset();
              createCharacters();
            }}
            text="生成角色表失败"
            error={error}
          />
        ) : (
          <Button
            onClick={() => createCharacters()}
            disabled={isPending}
            className="gap-1.5 md:gap-2"
          >
            <IconAccountPlus className="w-4 h-4 md:w-5 md:h-5" />
            {isPending ? '生成中...' : '生成角色表'}
          </Button>
        )}
      </EmptyUIBase>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex justify-between items-center px-2 md:px-4">
        <h2 className="text-base md:text-lg font-semibold">角色表</h2>
        <CopyIconButton content={getFormattedData()} />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 md:w-20 min-w-12 md:min-w-20 text-center border-r border-border">
                  编号
                </TableHead>
                <TableHead className="text-center whitespace-nowrap border-r border-border">
                  角色信息
                </TableHead>
                {!isMobile && (
                  <TableHead className="w-48 md:w-64 text-center whitespace-nowrap">
                    预览
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((character) => (
                <Fragment key={character.id}>
                  {isMobile
                    ? renderMobileView(character)
                    : renderDesktopView(character)}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
