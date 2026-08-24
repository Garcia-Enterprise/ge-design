import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Text as RNText,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  HeadingItem as BaseHeadingItem,
  TableOfContentsContentBaseProps,
  TableOfContentsRootBaseProps,
} from '@gv-tech/ui-core';
import { cn, slugify } from './lib/utils';
import { Text } from './text';

interface HeadingItem extends BaseHeadingItem {
  pageY: number;
}

interface TOCContextValue {
  headings: HeadingItem[];
  activeId: string | null;
  activeHeadingText: string | null;
  registerHeading: (id: string, text: string, level: number, pageY: number) => void;
  unregisterHeading: (id: string) => void;
  scrollToHeading: (id: string) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

const TOCContext = React.createContext<TOCContextValue | undefined>(undefined);

export function useTOC() {
  const context = React.useContext(TOCContext);
  if (!context) {
    throw new Error('useTOC must be used within a TableOfContents provider');
  }
  return context;
}

/**
 * Native Table of Contents Provider
 */
export function TableOfContents({ children, activeId: activeIdOverride }: TableOfContentsRootBaseProps) {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const activeHeadingText = React.useMemo(() => {
    const active = activeIdOverride || activeId;
    return headings.find((h) => h.id === active)?.text || null;
  }, [headings, activeId, activeIdOverride]);

  const registerHeading = React.useCallback((id: string, text: string, level: number, pageY: number) => {
    setHeadings((prev) => {
      const exists = prev.find((h) => h.id === id);
      if (exists && Math.abs(exists.pageY - pageY) < 1) {
        return prev;
      }

      const newHeadings = exists
        ? prev.map((h) => (h.id === id ? { id, text, level, pageY } : h))
        : [...prev, { id, text, level, pageY }];

      return newHeadings.sort((a, b) => a.pageY - b.pageY);
    });
  }, []);

  const unregisterHeading = React.useCallback((id: string) => {
    setHeadings((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const scrollToHeading = React.useCallback(
    (id: string) => {
      const heading = headings.find((h) => h.id === id);
      if (heading && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: heading.pageY - 20, animated: true });
      }
    },
    [headings],
  );

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = event.nativeEvent.contentOffset.y;

      // Find the current active heading
      let currentId = null;
      for (let i = headings.length - 1; i >= 0; i--) {
        if (scrollY >= headings[i].pageY - 100) {
          // Offset for header/buffer
          currentId = headings[i].id;
          break;
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    },
    [headings, activeId],
  );

  const value = React.useMemo(
    () => ({
      headings,
      activeId: activeIdOverride || activeId,
      activeHeadingText,
      registerHeading,
      unregisterHeading,
      scrollToHeading,
      onScroll,
      scrollViewRef,
    }),
    [
      headings,
      activeId,
      activeIdOverride,
      activeHeadingText,
      registerHeading,
      unregisterHeading,
      scrollToHeading,
      onScroll,
    ],
  );

  return (
    <TOCContext.Provider value={value}>
      <View className="flex-1">{children}</View>
    </TOCContext.Provider>
  );
}

/**
 * Heading component that registers itself with the TOC provider
 */
export function TableOfContentsHeader({
  children,
  level = 2,
  id: manualId,
  className,
}: {
  children: string;
  level?: number;
  id?: string;
  className?: string;
}) {
  const { registerHeading, unregisterHeading } = useTOC();
  const id = manualId || slugify(children);

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { y } = event.nativeEvent.layout;
      registerHeading(id, children, level, y);
    },
    [id, children, level, registerHeading],
  );

  React.useEffect(() => {
    return () => unregisterHeading(id);
  }, [id, unregisterHeading]);

  return (
    <View onLayout={onLayout}>
      <Text variant={level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'} className={className}>
        {children}
      </Text>
    </View>
  );
}

/**
 * Renders the TOC list of links
 */
export function TableOfContentsList({ className }: { className?: string }) {
  const { headings, activeId, scrollToHeading } = useTOC();

  const minLevel = React.useMemo(() => {
    if (headings.length === 0) return 0;
    return Math.min(...headings.map((h) => h.level));
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <View className={cn('space-y-2 p-4', className)}>
      <Text variant="overline" className="mb-2 font-bold">
        On this page
      </Text>
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        const paddingLeft = (heading.level - minLevel) * 16;

        return (
          <TouchableOpacity
            key={heading.id}
            onPress={() => scrollToHeading(heading.id)}
            style={{ paddingLeft }}
            className="py-1"
          >
            <RNText className={cn('text-sm', isActive ? 'text-primary font-bold' : 'text-muted-foreground')}>
              {heading.text}
            </RNText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * Wrapper for content that handles scrolling
 */
export function TableOfContentsContent({ children, className }: TableOfContentsContentBaseProps) {
  const { scrollViewRef, onScroll } = useTOC();

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={onScroll}
      className={cn('flex-1', className)}
      {...(Platform.OS !== 'web' && {
        scrollEventThrottle: 16,
        contentContainerStyle: { padding: 16 },
      })}
    >
      {children}
    </ScrollView>
  );
}

export { TableOfContentsHeader as TableOfContentsHeading };

TableOfContents.List = TableOfContentsList;
TableOfContents.Content = TableOfContentsContent;
TableOfContents.Heading = TableOfContentsHeader;
