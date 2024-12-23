import { IconButton } from '@/common/components';
import React, { useEffect, useRef } from 'react';
import IconCheck from '~icons/mdi/check';
import IconClose from '~icons/mdi/close';
import IconPencil from '~icons/mdi/pencil';

interface EditableCellProps extends ReactBasicProps {
  position?: 'right-center' | 'right-bottom';
  itemId: string;
  field: string;
  isEditing: boolean;
  value: string;
  onEdit: (itemId: string, field: string) => void;
  onConfirm: (itemId: string, field: string, newValue: string) => void;
  onCancel: (itemId: string, field: string) => void;
  onChange: (itemId: string, field: string, value: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  position = 'right-center',
  itemId,
  field,
  isEditing,
  value,
  onEdit,
  onConfirm,
  onCancel,
  onChange,
  className,
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.innerText = value;
      contentEditableRef.current.focus();

      // 将光标移动到内容的末尾
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(contentEditableRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const newValue = contentEditableRef.current.innerText;
      onChange(itemId, field, newValue);
    }
  };

  const handleConfirmClick = () => {
    const newValue = contentEditableRef.current?.innerText || '';
    onConfirm(itemId, field, newValue);
  };

  const positionClass =
    position === 'right-center'
      ? 'right-2 top-1/2 -translate-y-1/2'
      : 'right-2 bottom-2';

  return (
    <div className={className}>
      {isEditing ? (
        <div className="relative">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            className={`w-full min-h-[2rem] py-2 px-3 text-sm rounded bg-background dark:bg-background ${
              field === 'appearance' ? 'overflow-auto' : ''
            }`}
            ref={contentEditableRef}
            style={{
              outline: 'none',
            }}
          >
            {/* 不渲染 {value} */}
          </div>
          <div className={`absolute ${positionClass} flex space-x-1`}>
            <IconButton
              icon={<IconCheck className="w-4 h-4" />}
              onClick={handleConfirmClick}
              className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 w-5 h-5 md:w-6 md:h-6"
              aria-label="确认"
            />
            <IconButton
              icon={<IconClose className="w-4 h-4" />}
              onClick={() => onCancel(itemId, field)}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 w-5 h-5 md:w-6 md:h-6"
              aria-label="取消"
            />
          </div>
        </div>
      ) : (
        <div className="relative group py-2 px-3">
          <span className="block">{value}</span>
          <IconButton
            icon={<IconPencil className="w-4 h-4" />}
            onClick={() => onEdit(itemId, field)}
            className={`absolute ${positionClass} text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 w-5 h-5 md:w-6 md:h-6 transition-opacity`}
            aria-label={`编辑${field === 'name' ? '名称' : field === 'appearance' ? '外观' : '内容'}`}
          />
        </div>
      )}
    </div>
  );
};

export { EditableCell };
