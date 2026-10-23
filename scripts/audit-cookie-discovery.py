"""Check the built cookie policy and notice with JavaScript disabled; no live vendor calls."""
import json
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
dist = root / '.build'
checks = {}
external = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(java_script_enabled=False)

    def serve(route):
        url = urlsplit(route.request.url)
        if url.netloc != 'audit.local':
            external.append(url.hostname)
            route.abort()
            return
        if url.path.startswith('/_next/static/'):
            target = dist / 'static' / url.path.removeprefix('/_next/static/')
        elif url.path in ('/', '/politica-cookies'):
            target = dist / 'server/app' / ('index.html' if url.path == '/' else 'politica-cookies.html')
        else:
            target = root / 'public' / url.path.lstrip('/')
        target = target.resolve()
        if not (target.is_relative_to(dist.resolve()) or target.is_relative_to((root / 'public').resolve())) or not target.is_file():
            route.fulfill(status=404, body='Not found')
            return
        route.fulfill(content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream', body=target.read_bytes())

    context.route('**/*', serve)
    page = context.new_page()
    page.goto('https://audit.local/', wait_until='networkidle')
    checks['banner_visible_without_javascript'] = page.get_by_role('dialog').is_visible()
    checks['banner_policy_link'] = page.get_by_role('dialog').locator('a[href="/politica-cookies"]').count() == 1
    checks['footer_policy_link'] = page.locator('footer a[href="/politica-cookies"]').count() == 1
    page.get_by_role('dialog').locator('a[href="/politica-cookies"]').click()
    page.wait_for_url('**/politica-cookies')
    checks['policy_title'] = 'Cookies' in page.locator('h1').inner_text()
    checks['policy_body_visible_without_javascript'] = page.locator('article').is_visible() and 'Abacus.AI' in page.locator('article').inner_text()
    checks['policy_canonical'] = page.locator('link[rel="canonical"]').get_attribute('href').endswith('/politica-cookies')
    checks['no_external_requests_without_consent'] = not external
    # Sitemap is dynamic: confirm route registration, rather than claim a deployed HTTP test.
    checks['sitemap_route_registered_in_source'] = "'/politica-cookies'" in (root / 'app/sitemap.ts').read_text(encoding='utf8')
    browser.close()

out = {'mode': 'built-artifacts-javascript-disabled', 'published': False, 'checks': checks, 'passed': sum(checks.values()), 'total': len(checks), 'external_domains': external}
target = root / 'audit/2026-10-23/cookie-discovery.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(out, indent=2), encoding='utf8')
print(json.dumps(out))
raise SystemExit(0 if all(checks.values()) else 1)
