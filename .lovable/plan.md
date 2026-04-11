

## Fix: Add missing `useEffect` import in RideBooking.tsx

### Problem
`useEffect` is used in `RideBooking.tsx` but not imported, causing a build error and runtime crash.

### Fix
Add `useEffect` to the existing React import on line 1:
```typescript
import { useState, useCallback, useMemo, useEffect } from "react";
```

Single line change, no other modifications needed.

