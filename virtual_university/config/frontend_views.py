from pathlib import Path
from django.http import FileResponse, Http404
from django.conf import settings

FRONTEND_DIST = settings.BASE_DIR.parent / 'frontend' / 'dist'


def serve_frontend(request, path=''):
    requested = FRONTEND_DIST / path
    requested = requested.resolve()

    if not str(requested).startswith(str(FRONTEND_DIST.resolve())):
        raise Http404('Invalid path')

    if requested.exists() and requested.is_file():
        return FileResponse(open(requested, 'rb'))

    index = FRONTEND_DIST / 'index.html'
    if index.exists():
        return FileResponse(open(index, 'rb'))

    raise Http404(
        'Frontend not built. Run: cd frontend && npm run build'
    )
