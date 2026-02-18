# Logging Patterns for Debug Mode

Language-specific patterns for manual instrumentation when automatic instrumentation is not suitable or when more targeted logging is needed.

## Standard Log Format

All debug logging follows this format for consistent parsing:

```
[DEBUG:<session-id>] <timestamp> | <location> | <event-type> | <data>
```

Where:
- `session-id`: 8-character unique identifier (e.g., `abc12345`)
- `timestamp`: ISO 8601 format (e.g., `2024-01-15T10:30:45.123`)
- `location`: `function_name:line_number` or `filename:line_number`
- `event-type`: `ENTRY`, `EXIT`, `STATE`, `ERROR`, `EXTERNAL`
- `data`: JSON object with relevant values

## Python Patterns

### Function Entry/Exit

```python
import inspect
from datetime import datetime

SESSION_ID = "abc12345"  # Generate once per debug session

def debug_log(location, event_type, data):
    """Helper for consistent debug logging."""
    print(f"[DEBUG:{SESSION_ID}] {datetime.now().isoformat()} | {location} | {event_type} | {data}")

def process_order(order_id, items):
    location = f"process_order:{inspect.currentframe().f_lineno}"
    debug_log(location, "ENTRY", f'args={{"order_id": {order_id}, "items": {items}}}')

    # ... function body ...

    debug_log(f"process_order:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"success": true}}')
    return result
```

### State Logging

```python
def calculate_total(items):
    debug_log(f"calculate_total:{inspect.currentframe().f_lineno}", "ENTRY", f'args={{"items": {items}}}')

    subtotal = 0
    for i, item in enumerate(items):
        subtotal += item['price'] * item['quantity']
        # Log state each iteration
        debug_log(f"calculate_total:{inspect.currentframe().f_lineno}", "STATE",
                  f'{{"iteration": {i}, "subtotal": {subtotal}, "item": {item}}}')

    debug_log(f"calculate_total:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"total": {subtotal}}}')
    return subtotal
```

### Conditional/Decision Point Logging

```python
def validate_user(user):
    debug_log(f"validate_user:{inspect.currentframe().f_lineno}", "ENTRY", f'args={{"user": {user}}}')

    # Log the values being checked at decision points
    is_active = user.get('active', False)
    has_permission = user.get('role') in ['admin', 'user']

    debug_log(f"validate_user:{inspect.currentframe().f_lineno}", "STATE",
              f'{{"is_active": {str(is_active).lower()}, "has_permission": {str(has_permission).lower()}}}')

    if not is_active:
        debug_log(f"validate_user:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"valid": false, "reason": "inactive"}}')
        return False

    if not has_permission:
        debug_log(f"validate_user:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"valid": false, "reason": "no_permission"}}')
        return False

    debug_log(f"validate_user:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"valid": true}}')
    return True
```

### Exception Logging

```python
def fetch_data(url):
    debug_log(f"fetch_data:{inspect.currentframe().f_lineno}", "ENTRY", f'args={{"url": "{url}"}}')

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        debug_log(f"fetch_data:{inspect.currentframe().f_lineno}", "EXIT", f'return={{"status": {response.status_code}}}')
        return data

    except requests.RequestException as e:
        debug_log(f"fetch_data:{inspect.currentframe().f_lineno}", "ERROR",
                  f'{{"exception": "{type(e).__name__}", "message": "{str(e)}"}}')
        raise
```

### External Call Logging

```python
def query_database(query, params):
    debug_log(f"query_database:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "db_query", "query": "{query}", "params": {params}}}')

    result = db.execute(query, params)

    debug_log(f"query_database:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "db_result", "row_count": {len(result)}}}')

    return result
```

## JavaScript/TypeScript Patterns

### Function Entry/Exit

```javascript
const SESSION_ID = 'abc12345';

function debugLog(location, eventType, data) {
    console.log(`[DEBUG:${SESSION_ID}] ${new Date().toISOString()} | ${location} | ${eventType} | ${JSON.stringify(data)}`);
}

function processOrder(orderId, items) {
    const location = `processOrder:${new Error().stack?.split('\n')[1]?.match(/:(\d+):/)?.[1] || '?'}`;
    debugLog(location, 'ENTRY', { args: { orderId, items } });

    // ... function body ...

    debugLog(`processOrder:${getCurrentLine()}`, 'EXIT', { return: { success: true } });
    return result;
}

// Helper to get current line number
function getCurrentLine() {
    return new Error().stack?.split('\n')[2]?.match(/:(\d+):/)?.[1] || '?';
}
```

### State Logging

```javascript
function calculateTotal(items) {
    debugLog(`calculateTotal:${getCurrentLine()}`, 'ENTRY', { args: { items } });

    let subtotal = 0;
    items.forEach((item, i) => {
        subtotal += item.price * item.quantity;
        debugLog(`calculateTotal:${getCurrentLine()}`, 'STATE', {
            iteration: i,
            subtotal,
            item
        });
    });

    debugLog(`calculateTotal:${getCurrentLine()}`, 'EXIT', { return: { total: subtotal } });
    return subtotal;
}
```

### Async/Await Logging

```javascript
async function fetchUserData(userId) {
    debugLog(`fetchUserData:${getCurrentLine()}`, 'ENTRY', { args: { userId } });

    try {
        debugLog(`fetchUserData:${getCurrentLine()}`, 'EXTERNAL', { type: 'api_call', endpoint: `/users/${userId}` });

        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        debugLog(`fetchUserData:${getCurrentLine()}`, 'EXTERNAL', {
            type: 'api_response',
            status: response.status,
            dataKeys: Object.keys(data)
        });

        debugLog(`fetchUserData:${getCurrentLine()}`, 'EXIT', { return: { success: true } });
        return data;

    } catch (error) {
        debugLog(`fetchUserData:${getCurrentLine()}`, 'ERROR', {
            exception: error.name,
            message: error.message
        });
        throw error;
    }
}
```

### Promise Chain Logging

```javascript
function processData(input) {
    debugLog(`processData:${getCurrentLine()}`, 'ENTRY', { args: { input } });

    return Promise.resolve(input)
        .then(data => {
            debugLog(`processData:${getCurrentLine()}`, 'STATE', { step: 'validate', data });
            return validate(data);
        })
        .then(validated => {
            debugLog(`processData:${getCurrentLine()}`, 'STATE', { step: 'transform', validated });
            return transform(validated);
        })
        .then(result => {
            debugLog(`processData:${getCurrentLine()}`, 'EXIT', { return: result });
            return result;
        })
        .catch(error => {
            debugLog(`processData:${getCurrentLine()}`, 'ERROR', { exception: error.name, message: error.message });
            throw error;
        });
}
```

### React Component Logging

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        debugLog(`UserProfile:useEffect`, 'ENTRY', { args: { userId } });

        fetchUser(userId)
            .then(data => {
                debugLog(`UserProfile:useEffect`, 'STATE', { step: 'setUser', data });
                setUser(data);
            })
            .catch(error => {
                debugLog(`UserProfile:useEffect`, 'ERROR', { exception: error.name });
            });

        return () => {
            debugLog(`UserProfile:useEffect`, 'EXIT', { cleanup: true });
        };
    }, [userId]);

    debugLog(`UserProfile:render`, 'STATE', { hasUser: !!user });

    return user ? <div>{user.name}</div> : <Loading />;
}
```

## TypeScript Decorator Pattern

```typescript
function debugMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        const location = `${target.constructor.name}.${propertyKey}`;
        debugLog(location, 'ENTRY', { args });

        try {
            const result = originalMethod.apply(this, args);

            if (result instanceof Promise) {
                return result
                    .then(res => {
                        debugLog(location, 'EXIT', { return: res });
                        return res;
                    })
                    .catch(err => {
                        debugLog(location, 'ERROR', { exception: err.name, message: err.message });
                        throw err;
                    });
            }

            debugLog(location, 'EXIT', { return: result });
            return result;
        } catch (error) {
            debugLog(location, 'ERROR', { exception: error.name, message: error.message });
            throw error;
        }
    };

    return descriptor;
}

// Usage
class OrderService {
    @debugMethod
    processOrder(orderId: string, items: Item[]) {
        // Method implementation
    }

    @debugMethod
    async fetchInventory(sku: string) {
        // Async method implementation
    }
}
```

## Common Logging Scenarios

### API Request/Response

```python
# Python
def api_call(endpoint, method, payload):
    debug_log(f"api_call:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "request", "method": "{method}", "endpoint": "{endpoint}", "payload": {json.dumps(payload)}}}')

    response = requests.request(method, endpoint, json=payload)

    debug_log(f"api_call:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "response", "status": {response.status_code}, "body": {json.dumps(response.json())}}}')

    return response
```

### Database Operations

```javascript
// JavaScript
async function dbQuery(sql, params) {
    debugLog(`dbQuery:${getCurrentLine()}`, 'EXTERNAL', {
        type: 'db_query',
        sql,
        params
    });

    const startTime = Date.now();
    const result = await db.query(sql, params);
    const duration = Date.now() - startTime;

    debugLog(`dbQuery:${getCurrentLine()}`, 'EXTERNAL', {
        type: 'db_result',
        rowCount: result.rows.length,
        durationMs: duration
    });

    return result;
}
```

### File Operations

```python
# Python
def read_config(filepath):
    debug_log(f"read_config:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "file_read", "path": "{filepath}"}}')

    with open(filepath) as f:
        content = f.read()

    debug_log(f"read_config:{inspect.currentframe().f_lineno}", "EXTERNAL",
              f'{{"type": "file_result", "size": {len(content)}, "lines": {content.count(chr(10))}}}')

    return content
```

## Best Practices

1. **Be selective**: Instrument functions and lines relevant to the bug, not everything
2. **Log boundaries**: Always log function entry and exit to trace execution flow
3. **Log decisions**: Add logging at if/else, switch, and loop conditions
4. **Log external calls**: Capture inputs and outputs of API, DB, and file operations
5. **Include context**: Log variable values that affect behavior, not just that code executed
6. **Use consistent format**: Stick to the standard format for automated parsing
7. **Clean up after**: Remove debug logging once the bug is fixed
