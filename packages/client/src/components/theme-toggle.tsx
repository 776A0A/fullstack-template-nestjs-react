import { useTheme } from 'next-themes';
import { useIsMounted } from 'usehooks-ts';
import IconMoon from '~icons/mdi/moon-waning-crescent';
import IconSun from '~icons/mdi/white-balance-sunny';
import { IconButton } from './icon-button';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <IconButton
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      icon={
        resolvedTheme === 'dark' ? (
          <IconSun className="w-4 h-4" />
        ) : (
          <IconMoon className="w-4 h-4" />
        )
      }
      className={className}
    />
  );
}
