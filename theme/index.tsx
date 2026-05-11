import React, { Children, isValidElement, useEffect, useMemo, useState } from 'react';

export * from '@rspress/core/theme-original';

type TabValue = string;

export interface TabProps {
  label: React.ReactNode;
  value: TabValue;
  children: React.ReactNode;
}

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

type PackageManagerCommand =
  | 'install'
  | Partial<Record<PackageManager, string>>;

interface PackageManagerTabsProps {
  command: PackageManagerCommand;
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

const PACKAGE_MANAGERS: Array<{ label: string; value: PackageManager }> = [
  { label: 'npm', value: 'npm' },
  { label: 'Yarn', value: 'yarn' },
  { label: 'pnpm', value: 'pnpm' },
  { label: 'Bun', value: 'bun' },
];

const PACKAGE_MANAGER_STORAGE_KEY = 'tamer-package-manager';
const PACKAGE_MANAGER_EVENT = 'tamer-package-manager-change';

function normalizePackageManagerCommand(command: PackageManagerCommand) {
  if (command === 'install') {
    return {
      npm: 'npm install',
      yarn: 'yarn install',
      pnpm: 'pnpm install',
      bun: 'bun install',
    } satisfies Record<PackageManager, string>;
  }

  return command;
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

function readPackageManager() {
  if (typeof window === 'undefined') return undefined;

  const queryValue = new URLSearchParams(window.location.search).get('pm');
  if (queryValue && PACKAGE_MANAGERS.some((manager) => manager.value === queryValue)) {
    return queryValue as PackageManager;
  }

  const storedValue = window.localStorage.getItem(PACKAGE_MANAGER_STORAGE_KEY);
  if (storedValue && PACKAGE_MANAGERS.some((manager) => manager.value === storedValue)) {
    return storedValue as PackageManager;
  }

  return undefined;
}

function writePackageManager(value: PackageManager) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PACKAGE_MANAGER_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(PACKAGE_MANAGER_EVENT, { detail: value }));
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

export function PackageManagerTabs({ command }: PackageManagerTabsProps) {
  const commands = normalizePackageManagerCommand(command);
  const availableManagers = PACKAGE_MANAGERS.filter((manager) => commands[manager.value]);
  const firstValue = availableManagers[0]?.value;
  const [activeValue, setActiveValue] = useState<PackageManager | undefined>(firstValue);

  useEffect(() => {
    const nextValue = readPackageManager() ?? firstValue;
    setActiveValue((current) => {
      if (nextValue && commands[nextValue]) return nextValue;
      if (current && commands[current]) return current;
      return nextValue;
    });
  }, [commands, firstValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncPackageManager = (event: Event) => {
      const nextValue =
        event instanceof CustomEvent && typeof event.detail === 'string'
          ? event.detail
          : readPackageManager();

      if (nextValue && PACKAGE_MANAGERS.some((manager) => manager.value === nextValue)) {
        setActiveValue(nextValue as PackageManager);
      }
    };

    window.addEventListener(PACKAGE_MANAGER_EVENT, syncPackageManager);
    window.addEventListener('storage', syncPackageManager);
    return () => {
      window.removeEventListener(PACKAGE_MANAGER_EVENT, syncPackageManager);
      window.removeEventListener('storage', syncPackageManager);
    };
  }, []);

  if (!availableManagers.length) return null;

  const activeManager = availableManagers.find((manager) => manager.value === activeValue) ?? availableManagers[0];
  const activeCommand = commands[activeManager.value];

  if (!activeCommand) return null;

  return (
    <div className="tamer-package-tabs">
      <div className="tamer-package-tabs__options" role="tablist" aria-label="Package manager">
        {availableManagers.map((manager) => {
          const active = manager.value === activeManager.value;

          return (
            <button
              aria-selected={active}
              className={`tamer-package-tabs__option${active ? ' is-active' : ''}`}
              key={manager.value}
              onClick={() => {
                setActiveValue(manager.value);
                writePackageManager(manager.value);
              }}
              role="tab"
              type="button"
            >
              {manager.label}
            </button>
          );
        })}
      </div>
      <pre className="tamer-package-tabs__code">
        <code>{activeCommand}</code>
      </pre>
    </div>
  );
}
