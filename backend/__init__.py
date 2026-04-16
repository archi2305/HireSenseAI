import os
import sys

# Allow legacy absolute imports like `import database` to work
# when app is launched as `backend.main:app` from repo root.
_backend_dir = os.path.dirname(__file__)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)
