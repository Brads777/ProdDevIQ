---
name: react-master
description: >
  Comprehensive React guide covering component patterns, state management,
  hooks best practices, React Native, performance optimization, and
  UI patterns. Consolidates 8 React skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# React Master Guide

Comprehensive reference for modern React development (React 18-19), covering component architecture, hooks, state management, performance optimization, UI patterns, React Native, and server components.

## When to Use This Skill

Apply this skill when:
- Building React components or applications
- Choosing state management solutions
- Optimizing React performance
- Implementing React Native mobile apps
- Using React hooks (useState, useEffect, useCallback, useMemo)
- Designing component APIs and composition patterns
- Handling forms, async data, loading states, and errors
- Working with React Server Components (React 19)
- Migrating from class components to hooks
- Reviewing React code for best practices

---

## Quick Reference

### Component Pattern Decision Tree

```
Need to share layout/behavior with children?
  ├─ Yes → Compound Components (tabs, accordion)
  └─ No → Continue

Need dynamic rendering flexibility?
  ├─ Yes → Render Props or Children as Function
  └─ No → Continue

Need to enhance existing component?
  ├─ Yes → HOC (use sparingly, prefer hooks)
  └─ No → Standard Component
```

### Hook Usage Decision Tree

```
Storing state?
  ├─ Derived from props/state? → Calculate during render
  ├─ Expensive calculation? → useMemo
  ├─ Needs to persist across renders? → useState
  └─ Doesn't trigger re-render? → useRef

Creating callback?
  ├─ Passed to memoized child? → useCallback
  ├─ Used in dependency array? → useCallback
  └─ Otherwise → Regular function

Side effect needed?
  ├─ On user interaction? → Event handler (NOT useEffect)
  ├─ Syncing with external system? → useEffect
  ├─ Data fetching? → Library (TanStack Query, SWR)
  └─ Setting interval/timeout? → useEffect with cleanup
```

### State Management Decision Tree

```
How much data? How many components?
  ├─ Single component → useState
  ├─ Parent + few children → Lift state + props
  ├─ Multiple unrelated components → Context API or Zustand
  ├─ Server data (API) → TanStack Query or SWR
  └─ Complex global state → Zustand or Redux Toolkit
```

---

## 1. Component Patterns

### Composition Over Inheritance

**Key Principle:** Build complex UIs from small, focused components.

```tsx
// ❌ AVOID: Inheritance
class SpecialButton extends Button {
  // React doesn't encourage this
}

// ✅ GOOD: Composition
function SpecialButton({ children, ...props }: ButtonProps) {
  return (
    <Button {...props} className="special">
      <Icon />
      {children}
    </Button>
  );
}
```

### Compound Components

Best for components with complex internal state shared across multiple children (tabs, accordions, select menus).

```tsx
// API Design
<Tabs defaultValue="profile">
  <TabList>
    <Tab value="profile">Profile</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="profile">Profile content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>

// Implementation with Context
type TabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function Tabs({
  defaultValue,
  children
}: {
  defaultValue: string;
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }
  return context;
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
}
```

### Render Props (Legacy Pattern - Prefer Hooks)

Still useful for libraries that need maximum flexibility, but custom hooks are preferred for new code.

```tsx
// Render prop pattern
function MouseTracker({
  render
}: {
  render: (position: { x: number; y: number }) => ReactNode;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />

// ✅ BETTER: Custom hook
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

// Usage
function Component() {
  const { x, y } = useMousePosition();
  return <p>Mouse at {x}, {y}</p>;
}
```

### Higher-Order Components (Legacy - Use Sparingly)

HOCs are still valid for cross-cutting concerns in libraries, but hooks are preferred for application code.

```tsx
// HOC pattern (older pattern, still useful for enhancing third-party components)
function withAuth<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;

    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);

// ✅ BETTER: Custom hook + component
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

// Usage
<RequireAuth>
  <Dashboard />
</RequireAuth>
```

---

## 2. Hooks Best Practices

### useState - When and How

```tsx
// ✅ GOOD: Single source of truth
function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Derived state - NO extra useState needed
  const isValid = email.includes('@') && password.length >= 8;

  return (
    <form>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={!isValid}>Submit</button>
    </form>
  );
}

// ❌ AVOID: Redundant state
function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false); // ❌ Redundant!

  useEffect(() => {
    setIsValid(email.includes('@') && password.length >= 8);
  }, [email, password]);

  // ...
}
```

### useState - Lazy Initialization

For expensive initial values, pass a function:

```tsx
// ❌ AVOID: Runs on every render
const [data, setData] = useState(expensiveComputation());

// ✅ GOOD: Runs only once
const [data, setData] = useState(() => expensiveComputation());

// Example: Reading from localStorage
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});
```

### useState - Functional Updates

Use functional updates when new state depends on previous state:

```tsx
// ❌ RISKY: May use stale state in callbacks
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1); // ❌ count is stale in memoized callback
  }, []); // Empty deps means 'count' is always 0

  return <button onClick={increment}>{count}</button>;
}

// ✅ GOOD: Functional update
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prev => prev + 1); // ✅ Always uses current state
  }, []); // Can safely omit 'count' from deps

  return <button onClick={increment}>{count}</button>;
}
```

### useCallback - When to Use

Only use `useCallback` when needed:
1. Passing callback to memoized child component
2. Callback is a dependency in useEffect or other hooks
3. Callback is an expensive operation

```tsx
// ❌ UNNECESSARY: Over-optimization
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // No benefit here

  return <button onClick={handleClick}>Click</button>;
}

// ✅ GOOD: Needed for memoized child
const MemoizedChild = memo(({ onClick }: { onClick: () => void }) => {
  return <ExpensiveComponent onClick={onClick} />;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // ✅ Prevents MemoizedChild re-render

  return <MemoizedChild onClick={handleClick} />;
}
```

### useMemo - When to Use

Only use `useMemo` for:
1. Expensive calculations
2. Preserving object/array reference identity for dependencies
3. Values passed to memoized components

```tsx
// ❌ UNNECESSARY: Simple calculation
const doubled = useMemo(() => count * 2, [count]);

// ✅ GOOD: Expensive calculation
const sorted = useMemo(() => {
  return items.slice().sort((a, b) => {
    // Complex sorting logic
    return expensiveCompare(a, b);
  });
}, [items]);

// ✅ GOOD: Preserve reference for dependency
function Component({ userId }: { userId: string }) {
  const queryOptions = useMemo(() => ({
    userId,
    includeMetadata: true
  }), [userId]); // ✅ Same object reference when userId unchanged

  useEffect(() => {
    fetchUser(queryOptions);
  }, [queryOptions]); // Won't re-run unnecessarily
}
```

### Custom Hooks

Extract reusable stateful logic:

```tsx
// Custom hook for form fields
function useFormField(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return {
    value,
    onChange,
    onBlur,
    touched,
    reset: () => {
      setValue(initialValue);
      setTouched(false);
    }
  };
}

// Usage
function Form() {
  const email = useFormField('');
  const password = useFormField('');

  return (
    <form>
      <input {...email} type="email" />
      <input {...password} type="password" />
    </form>
  );
}

// Custom hook for async operations
function useAsync<T>(asyncFn: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<{
    loading: boolean;
    data: T | null;
    error: Error | null;
  }>({ loading: true, data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    setState({ loading: true, data: null, error: null });

    asyncFn()
      .then(data => {
        if (!cancelled) {
          setState({ loading: false, data, error: null });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({ loading: false, data: null, error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { loading, data, error } = useAsync(
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    [userId]
  );

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <Profile user={data} />;
}
```

---

## 3. useEffect Deep Dive

### The Golden Rule

**useEffect is for synchronizing with external systems.** Most of the time, you don't need it.

### When NOT to Use useEffect

```tsx
// ❌ WRONG: Using Effect for derived state
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    setFilteredItems(items.filter(item => item.active));
  }, [items]);

  // ...
}

// ✅ CORRECT: Calculate during render
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.active);
  // ...
}

// ❌ WRONG: Using Effect for event handling
function Form() {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.length > 10) {
      alert('Too long!');
    }
  }, [value]);

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// ✅ CORRECT: Handle in event handler
function Form() {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 10) {
      alert('Too long!');
    }
    setValue(newValue);
  };

  return <input value={value} onChange={handleChange} />;
}
```

### When TO Use useEffect

Valid use cases:
1. Fetching data (though libraries like TanStack Query are better)
2. Setting up subscriptions (WebSocket, event listeners)
3. Manually updating the DOM (refs)
4. Integrating with third-party libraries
5. Analytics/logging

### Dependency Arrays

```tsx
// ❌ WRONG: Missing dependencies
function Component({ userId }: { userId: string }) {
  useEffect(() => {
    fetchUser(userId); // ❌ userId not in deps
  }, []);
}

// ❌ WRONG: Disabling the linter
function Component({ userId }: { userId: string }) {
  useEffect(() => {
    fetchUser(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ❌ Never do this
}

// ✅ CORRECT: Include all dependencies
function Component({ userId }: { userId: string }) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]); // ✅ Runs when userId changes
}

// ✅ CORRECT: Stable function reference
function Component({ userId }: { userId: string }) {
  const fetchData = useCallback(() => {
    fetchUser(userId);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ fetchData is stable
}
```

### Cleanup Functions

Always clean up subscriptions, timers, and event listeners:

```tsx
// ✅ Event listener cleanup
function Component() {
  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // ✅ Cleanup
    };
  }, []);
}

// ✅ Timer cleanup
function Component() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick');
    }, 1000);

    return () => {
      clearInterval(timer); // ✅ Cleanup
    };
  }, []);
}

// ✅ Fetch abort cleanup
function Component({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => {
      controller.abort(); // ✅ Cancel pending request
    };
  }, [userId]);

  return user ? <div>{user.name}</div> : <Spinner />;
}

// ✅ WebSocket cleanup
function Component() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      console.log(event.data);
    };

    return () => {
      ws.close(); // ✅ Cleanup
    };
  }, []);
}
```

### Common useEffect Pitfalls

```tsx
// ❌ PITFALL: Infinite loop
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // ❌ Triggers re-render → infinite loop
  }, [count]);
}

// ✅ FIX: Remove dependency or add condition
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 10) {
      setCount(count + 1);
    }
  }, [count]);
}

// ❌ PITFALL: Object/array dependency
function Component() {
  const config = { foo: 'bar' }; // ❌ New object every render

  useEffect(() => {
    console.log('Config changed');
  }, [config]); // Runs every render!
}

// ✅ FIX: Use primitive dependencies or useMemo
function Component() {
  const config = useMemo(() => ({ foo: 'bar' }), []); // ✅ Stable reference

  useEffect(() => {
    console.log('Config changed');
  }, [config]);
}
```

---

## 4. State Management

### Local State (useState)

Use for:
- Single component state
- Form inputs
- UI toggles (modals, dropdowns)

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

### Lifting State Up

Use when 2-5 components need shared state:

```tsx
function Parent() {
  const [filter, setFilter] = useState('');

  return (
    <>
      <SearchBar value={filter} onChange={setFilter} />
      <ItemList filter={filter} />
    </>
  );
}
```

### Context API

Use for:
- Theme, locale, auth user
- Avoiding prop drilling through many levels
- NOT for frequently changing state (causes re-renders)

```tsx
// Create context with TypeScript
type ThemeContextValue = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}
```

### Zustand (Recommended for Global State)

Lightweight, doesn't require providers, minimal re-renders:

```tsx
import { create } from 'zustand';

type Store = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage - component only re-renders when 'count' changes
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

// Async actions
type UserStore = {
  user: User | null;
  loading: boolean;
  fetchUser: (id: string) => Promise<void>;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
```

### TanStack Query (React Query) - For Server State

Best for data fetching and server state caching:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return <div>{data.name}</div>;
}

// Mutations
function UpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProfile: Profile) =>
      fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(newProfile),
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update
    </button>
  );
}
```

### Redux Toolkit (For Complex Global State)

Use when you need:
- Time-travel debugging
- Complex state logic with many actions
- Team familiar with Redux patterns

```tsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer makes this safe
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Usage
import { useDispatch, useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

---

## 5. Performance Optimization

### React.memo

Prevents re-renders when props haven't changed:

```tsx
// ❌ Re-renders on every parent render
function ExpensiveChild({ data }: { data: Data }) {
  return <ComplexVisualization data={data} />;
}

// ✅ Only re-renders when data changes
const ExpensiveChild = memo(function ExpensiveChild({
  data
}: {
  data: Data
}) {
  return <ComplexVisualization data={data} />;
});

// Custom comparison
const ExpensiveChild = memo(
  function ExpensiveChild({ data }: { data: Data }) {
    return <ComplexVisualization data={data} />;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.data.id === nextProps.data.id;
  }
);
```

### Lazy Loading and Code Splitting

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const Dashboard = lazy(() => import('./Dashboard'));
const Chart = lazy(() => import('./Chart'));
const Editor = lazy(() => import('./Editor'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}

// Route-based code splitting
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const Contact = lazy(() => import('./routes/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Virtualization

For long lists (1000+ items), use virtualization:

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Avoiding Unnecessary Re-renders

```tsx
// ❌ PROBLEM: Object/array created every render
function Parent() {
  const config = { foo: 'bar' }; // New object every render
  return <Child config={config} />;
}

const Child = memo(({ config }) => {
  // Still re-renders every time!
  return <div>{config.foo}</div>;
});

// ✅ FIX: Stable reference
function Parent() {
  const config = useMemo(() => ({ foo: 'bar' }), []);
  return <Child config={config} />;
}

// ❌ PROBLEM: Inline function prop
function Parent() {
  return <Child onClick={() => console.log('clicked')} />;
}

// ✅ FIX: useCallback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />;
}
```

### React DevTools Profiler

Use to identify performance bottlenecks:

1. Open React DevTools
2. Go to Profiler tab
3. Click record (blue circle)
4. Interact with your app
5. Click stop
6. Review flame graph and ranked components

Look for:
- Components that render too frequently
- Expensive render times (yellow/red)
- Unnecessary renders (props didn't change)

---

## 6. UI Patterns

### Form Handling with react-hook-form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### Modal Pattern

```tsx
import { createPortal } from 'react-dom';

function Modal({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </Modal>
    </>
  );
}
```

### Toast Notifications

```tsx
import { createContext, useContext, useState, useCallback } from 'react';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Usage
function MyComponent() {
  const { addToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      addToast('Saved successfully!', 'success');
    } catch (error) {
      addToast('Failed to save', 'error');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Loading States

```tsx
// Simple loading state
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <div>{data.name}</div>;
}

// Suspense-based (React 18+)
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile userId="123" />
    </Suspense>
  );
}

// Skeleton loading
function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-title" />
      <div className="skeleton-text" />
    </div>
  );
}

function CardList() {
  const { data, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
  });

  if (isLoading) {
    return (
      <>
        {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
      </>
    );
  }

  return data.map(card => <Card key={card.id} {...card} />);
}
```

### Error Boundaries

```tsx
import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

---

## 7. React Native

### Project Structure

```
my-app/
├── src/
│   ├── screens/        # Screen components
│   ├── components/     # Reusable components
│   ├── navigation/     # Navigation config
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilities
│   ├── services/       # API services
│   ├── store/          # State management
│   └── types/          # TypeScript types
├── assets/             # Images, fonts
├── app.json            # Expo config
└── App.tsx             # Entry point
```

### React Navigation (v6)

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Type-safe navigation
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// In a screen component
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function ProfileScreen({ route, navigation }: Props) {
  const { userId } = route.params;

  return (
    <View>
      <Text>User ID: {userId}</Text>
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

### Platform-Specific Code

```tsx
import { Platform, StyleSheet } from 'react-native';

// Platform.OS
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

// Platform.select
const fontSize = Platform.select({
  ios: 16,
  android: 18,
  default: 14,
});

// Separate files
// Component.ios.tsx
// Component.android.tsx
// Import: import Component from './Component' (auto-selects)

// Platform-specific extensions
import { Button } from 'react-native';

const MyButton = Platform.select({
  ios: () => <Button title="iOS Button" />,
  android: () => <Button title="Android Button" />,
})();
```

### Expo vs Bare React Native

**Use Expo when:**
- Rapid prototyping
- Don't need custom native modules
- Want OTA updates
- Building for both iOS and Android

**Use Bare React Native when:**
- Need custom native code (Swift/Kotlin)
- Require specific native modules
- Full control over build process
- Performance-critical apps

```bash
# Create Expo app
npx create-expo-app my-app

# Create bare React Native app
npx react-native init MyApp --template react-native-template-typescript

# Eject from Expo (if needed later)
expo eject
```

### React Native Styling

```tsx
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

// Compose styles
<Text style={[styles.text, styles.bold, { color: 'red' }]}>Text</Text>

// Conditional styles
<View style={[styles.box, isActive && styles.active]} />
```

### Common React Native Components

```tsx
import {
  View,          // Container (like div)
  Text,          // Text display
  Image,         // Images
  ScrollView,    // Scrollable container
  FlatList,      // Optimized list
  TextInput,     // Input field
  TouchableOpacity, // Touchable button
  ActivityIndicator, // Spinner
  Modal,         // Modal overlay
  SafeAreaView,  // Respects safe areas (notch, etc)
} from 'react-native';

// FlatList (optimized for long lists)
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={item => item.id}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>

// SafeAreaView (iOS notch)
<SafeAreaView style={styles.container}>
  <Text>Content</Text>
</SafeAreaView>
```

---

## 8. Server Components (React 19)

### When to Use Server vs Client Components

**Server Components (default in Next.js 13+ App Router):**
- Fetching data from database/API
- Accessing backend resources
- Keeping sensitive data on server (API keys)
- Large dependencies that don't need client-side JS

**Client Components (marked with `'use client'`):**
- Interactivity (onClick, onChange)
- Hooks (useState, useEffect)
- Browser APIs (localStorage, window)
- Event listeners

### Server Component Example

```tsx
// app/posts/page.tsx (Server Component)
async function PostsPage() {
  // Fetch directly in component (no useEffect needed)
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// This runs on the server, HTML sent to client
```

### Client Component Example

```tsx
'use client'; // Mark as client component

import { useState } from 'react';

function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

### Composing Server and Client Components

```tsx
// Server Component (default)
async function PostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {/* Client component for interactivity */}
      <LikeButton postId={post.id} />

      {/* Server component for comments */}
      <Comments postId={post.id} />
    </article>
  );
}

// Client component
'use client';
function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  // ...
}

// Server component
async function Comments({ postId }: { postId: string }) {
  const comments = await fetchComments(postId);
  return (
    <div>
      {comments.map(c => <Comment key={c.id} comment={c} />)}
    </div>
  );
}
```

### Data Fetching Patterns in React 19

```tsx
// Server Component - parallel fetching
async function Dashboard() {
  // These fetch in parallel
  const [user, posts, stats] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchStats(),
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <Stats stats={stats} />
    </div>
  );
}

// Streaming with Suspense
import { Suspense } from 'react';

function Dashboard() {
  return (
    <div>
      {/* User loads first, immediately */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile />
      </Suspense>

      {/* Posts stream in when ready */}
      <Suspense fallback={<PostsSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}

async function PostList() {
  const posts = await fetchPosts(); // Async server component
  return <>{posts.map(p => <Post key={p.id} post={p} />)}</>;
}
```

### Server Actions (React 19 + Next.js 14+)

```tsx
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');

  await db.posts.create({
    data: { title, content },
  });

  revalidatePath('/posts');
}

// app/new-post/page.tsx
import { createPost } from '../actions';

function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" type="text" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// With useFormStatus (client component)
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}
```

---

## 9. Anti-Patterns to Avoid

### Prop Drilling

```tsx
// ❌ BAD: Passing props through many levels
function App() {
  const [user, setUser] = useState(null);
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finally use it here
  return <div>{user.name}</div>;
}

// ✅ GOOD: Use Context
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const { user } = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

### Unnecessary State

```tsx
// ❌ BAD: State for derived values
function Component({ price }) {
  const [price, setPrice] = useState(props.price);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTax = price * 0.1;
    const newTotal = price + newTax;
    setTax(newTax);
    setTotal(newTotal);
  }, [price]);

  // ...
}

// ✅ GOOD: Calculate during render
function Component({ price }) {
  const tax = price * 0.1;
  const total = price + tax;
  // ...
}
```

### useEffect for Derived State

```tsx
// ❌ BAD: useEffect to sync state
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    setFilteredResults(results.filter(r => r.active));
  }, [results]);

  // ...
}

// ✅ GOOD: Derive during render
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const filteredResults = results.filter(r => r.active);
  // ...
}
```

### Over-Abstraction

```tsx
// ❌ BAD: Premature abstraction
function useFormField(name, initialValue, validator, transformer, formatter) {
  // 100 lines of complex generic logic
}

// Used once in the entire app

// ✅ GOOD: Simple, specific
function EmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value.includes('@')) {
      setError('Invalid email');
    } else {
      setError('');
    }
  };

  return (
    <>
      <input value={email} onChange={handleChange} />
      {error && <span>{error}</span>}
    </>
  );
}

// Extract to custom hook when you have 2-3 similar cases
```

### Massive Components

```tsx
// ❌ BAD: 500-line component
function Dashboard() {
  // 50 useState calls
  // 20 useEffect calls
  // 10 event handlers
  // 300 lines of JSX
}

// ✅ GOOD: Break into smaller components
function Dashboard() {
  return (
    <>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </>
  );
}

function MainContent() {
  return (
    <>
      <StatsCards />
      <RecentActivity />
      <Charts />
    </>
  );
}
```

### Index Files with Re-Exports (Barrel Exports)

```tsx
// ❌ BAD: Barrel exports hurt tree-shaking
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
// ... 50 more components

// Usage - imports entire file even if only using Button
import { Button } from '@/components';

// ✅ GOOD: Direct imports
import { Button } from '@/components/Button';
```

---

## Additional Resources

### Official Docs
- [React Docs](https://react.dev) - Official React documentation
- [React Native Docs](https://reactnative.dev) - React Native documentation
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [React Hook Form](https://react-hook-form.com) - Form validation

### Tools
- React DevTools (browser extension)
- React Native Debugger
- Flipper (React Native debugging)
- Why Did You Render (performance debugging)

### Testing
- Vitest - Unit testing
- React Testing Library - Component testing
- Playwright - E2E testing
- Jest - Legacy unit testing

---

## Quick Tips Summary

1. **Components**: Use composition over inheritance, keep components small and focused
2. **Hooks**: useState for state, useEffect only for external systems, useCallback/useMemo sparingly
3. **State**: Local state by default, lift when needed, Context for global non-frequent updates, Zustand for app state, TanStack Query for server state
4. **Performance**: Measure first with DevTools, use memo/lazy/Suspense for heavy components, virtualize long lists
5. **Forms**: Use react-hook-form with Zod validation
6. **React Native**: Use Expo for speed, bare for control, React Navigation for routing
7. **Server Components**: Server by default, client only when needed for interactivity
8. **Avoid**: Prop drilling, unnecessary state, useEffect for derived data, over-abstraction, massive components
