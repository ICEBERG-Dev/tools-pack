# Ice Tools Pack
######all tools you need

## How to Install
_in your package.json_
```json
    "dependencies": {
        "tools-pack":"github:iceberg-dev/tools-pack"
    }
```
## Docs
_include in your file_
```javascript
    const tools = require('tools-pack');
```

_usage example_
```javascript
    tools.sys.checkRequired({key:"some key", date: "2022-01-01"}, ['key', 'date'])
```


### Existing tools
* crypt
* sys
* db
* rest

#### check documentation for more...