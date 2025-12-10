# Critical Auth Fix - Token Clearing Issue

## The Problem
After successful login, the JWT token was immediately cleared from localStorage, redirecting users back to the login screen. The dashboard would appear briefly before disappearing.

## Root Cause
The logout route had an IIFE (Immediately Invoked Function Expression) that ran on **every render**:

```jsx
<Route
  path="/logout"
  element={
    <div style={{ padding: '20px', color: '#fff' }}>
      {(() => {
        removeToken();           // ❌ Runs on every render!
        dispatchAuthChanged();
        window.location.href = '/';
        return null;
      })()}
    </div>
  }
/>
```

When `isLoggedIn` state changed from false to true after login:
1. Routes conditionally re-rendered (from login routes to authenticated routes)
2. The logout route component was created/rendered
3. The IIFE executed, clearing the token
4. `dispatchAuthChanged()` fired with no token
5. Auth listener saw null token and set `isLoggedIn = false`
6. User redirected back to login screen

## The Solution
Move logout logic to a proper component that uses `useEffect`:

```tsx
// apps/web/src/pages/LogoutPage.tsx
import { useEffect } from 'react';
import { removeToken, dispatchAuthChanged } from '../utils/authStorage';

export default function LogoutPage() {
  useEffect(() => {
    removeToken();
    dispatchAuthChanged();
    window.location.href = '/';
  }, []);

  return <div style={{ padding: '20px', color: '#fff' }}>Logging out...</div>;
}
```

Then in App.tsx:
```jsx
<Route path="/logout" element={<LogoutPage />} />
```

Now the logout logic only runs when:
1. The LogoutPage component mounts
2. Which only happens when the `/logout` route is actually navigated to
3. Not when routes conditionally render on state changes

## Key Lesson
**Never run side effects (like token clearing) in component render body**. Use `useEffect` for side effects that should only happen under specific conditions.

## Commit
`40a112c` - Fix: Move logout IIFE to component to prevent spurious token clearing
