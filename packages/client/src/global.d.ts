declare global {
  interface ReactBasicProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  type Nullable<T> = T | null | undefined;
}

export {};
