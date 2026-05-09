import React, { Children, isValidElement, useEffect, useMemo, useState } from 'react';

export * from '@rspress/core/theme-original';

type TabValue = string;

export interface TabProps {
  label: React.ReactNode;
  value: TabValue;
  children: React.ReactNode;
}

interface TabsProps {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: TabValue;
  queryKey?: string;
}

interface NormalizedTab {
  label: React.ReactNode;
  value: TabValue;
  children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

function readQueryValue(queryKey?: string) {
  if (!queryKey || typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get(queryKey) ?? undefined;
}

function writeQueryValue(queryKey: string | undefined, value: TabValue) {
  if (!queryKey || typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set(queryKey, value);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

const TAB_ICON_BY_VALUE: Record<string, string> = {
  ios: '/assets/icon-ios.svg',
  android: '/assets/icon-android.svg',
  'tamer-app': '/assets/icon-tamer.png',
};

function getIconSrc(label: React.ReactNode, value: TabValue): string | undefined {
  if (TAB_ICON_BY_VALUE[value]) return TAB_ICON_BY_VALUE[value];
  const text =
    typeof label === 'string'
      ? label.toLowerCase()
      : typeof value === 'string'
        ? value.toLowerCase()
        : '';
  if (text.includes('android')) return TAB_ICON_BY_VALUE.android;
  if (text.includes('ios') || text.includes('swift') || text.includes('objc')) return TAB_ICON_BY_VALUE.ios;
  if (text.includes('tamer')) return TAB_ICON_BY_VALUE['tamer-app'];
  return undefined;
}

function getIconFallback(label: React.ReactNode, value: TabValue) {
  const text =
    typeof label === 'string'
      ? label
      : typeof value === 'string'
        ? value
        : '';
  return text.trim().slice(0, 3) || value.slice(0, 3);
}

function normalizeTabs(children: React.ReactNode): NormalizedTab[] {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const props = child.props as Partial<TabProps>;
      if (!props.value || !props.label) return undefined;

      return {
        label: props.label,
        value: props.value,
        children: props.children,
      };
    })
    .filter((tab): tab is NormalizedTab => Boolean(tab));
}

export function Tabs({ children, className, defaultValue, queryKey }: TabsProps) {
  const tabs = useMemo(() => normalizeTabs(children), [children]);
  const firstValue = tabs[0]?.value;
  const initialValue = readQueryValue(queryKey) ?? defaultValue ?? firstValue;
  const [activeValue, setActiveValue] = useState<TabValue | undefined>(initialValue);

  useEffect(() => {
    const nextValue = readQueryValue(queryKey) ?? defaultValue ?? firstValue;
    setActiveValue((current) => {
      if (current && tabs.some((tab) => tab.value === current)) return current;
      return nextValue;
    });
  }, [defaultValue, firstValue, queryKey, tabs]);

  useEffect(() => {
    if (!queryKey || typeof window === 'undefined') return;

    const syncFromUrl = () => {
      const queryValue = readQueryValue(queryKey);
      if (queryValue && tabs.some((tab) => tab.value === queryValue)) {
        setActiveValue(queryValue);
      }
    };

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [queryKey, tabs]);

  if (!tabs.length) return null;

  const activeTab = tabs.find((tab) => tab.value === activeValue) ?? tabs[0];

  return (
    <section className={['tamer-card-tabs', className].filter(Boolean).join(' ')}>
      <div className="tamer-card-tabs__options" role="tablist">
        {tabs.map((tab) => {
          const active = tab.value === activeTab.value;

          return (
            <button
              aria-selected={active}
              className={`tamer-card-tabs__option${active ? ' is-active' : ''}`}
              key={tab.value}
              onClick={() => {
                setActiveValue(tab.value);
                writeQueryValue(queryKey, tab.value);
              }}
              role="tab"
              type="button"
            >
              <span className="tamer-card-tabs__icon" aria-hidden="true">
                {getIconSrc(tab.label, tab.value) ? (
                  <img
                    alt=""
                    className="tamer-card-tabs__icon-img"
                    src={getIconSrc(tab.label, tab.value)}
                  />
                ) : (
                  getIconFallback(tab.label, tab.value)
                )}
              </span>
              <span className="tamer-card-tabs__label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="tamer-card-tabs__panel" key={activeTab.value} role="tabpanel">
        {activeTab.children}
      </div>
    </section>
  );
}
