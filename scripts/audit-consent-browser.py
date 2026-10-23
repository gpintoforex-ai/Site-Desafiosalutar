"""Disposable browser consent audit. External requests are observed then intercepted.
No admin login, contact submission, clinical data or message sending is performed.
Supports public production before-tests and a built Next site served in-memory after-tests.
"""
import argparse
import json
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

args = argparse.ArgumentParser()
args.add_argument('--base', default='https://desafiosalutar.pt')
args.add_argument('--output', required=True)
args.add_argument('--static-dir')
args.add_argument('--key', default='nv-cookie-consent-v1')
opts = args.parse_args()
root = Path(__file__).resolve().parents[1]
result = {'base': opts.base, 'mode': 'built-site-in-memory' if opts.static_dir else 'live-public', 'external_requests_intercepted': True, 'tests': {}, 'external_domains': {}}

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='pt-PT')
    stage = 'initial'
    requests = []

    def route_handler(route):
        url = urlsplit(route.request.url)
        if url.netloc != urlsplit(opts.base).netloc:
            requests.append({'stage': stage, 'host': url.hostname, 'type': route.request.resource_type, 'referer_present': bool(route.request.headers.get('referer'))})
            # Do not send this synthetic audit browser's data to third-party providers.
            if route.request.resource_type == 'document': route.fulfill(content_type='text/html', body='<html><body>External provider intercepted by audit</body></html>')
            elif route.request.resource_type == 'script': route.fulfill(content_type='text/javascript', body='/* external provider intercepted by audit */')
            else: route.abort()
            return
        if not opts.static_dir:
            route.continue_(); return
        dist = root / opts.static_dir
        path = url.path
        if path.startswith('/_next/static/'):
            target = dist / 'static' / path.removeprefix('/_next/static/')
        elif path in ('/', '/contactos', '/politica-privacidade', '/politica-cookies', '/pedido-recomendacao', '/produtos', '/informacao-legal'):
            target = dist / 'server/app' / ('index.html' if path == '/' else path.strip('/') + '.html')
        else:
            target = root / 'public' / path.lstrip('/')
        target = target.resolve()
        if not (target.is_relative_to(dist.resolve()) or target.is_relative_to((root / 'public').resolve())) or not target.is_file():
            route.fulfill(status=404, body='Audit fixture not found'); return
        mime = 'text/javascript' if target.suffix == '.js' else mimetypes.guess_type(target.name)[0] or 'application/octet-stream'
        route.fulfill(content_type=mime, body=target.read_bytes())

    context.route('**/*', route_handler)
    page = context.new_page()
    page.set_default_timeout(20000)
    def check(name, value): result['tests'][name] = bool(value)
    def frames(): return page.locator('iframe[title^="Mapa com"]').count()
    def pref(): return page.evaluate('(key) => JSON.parse(localStorage.getItem(key))', opts.key)
    def maps_requested(s): return any(r['stage'] == s and 'google' in (r['host'] or '') and r['type'] == 'document' for r in requests)
    def open_settings():
        page.get_by_role('button', name='Gerir cookies', exact=True).click()
        if not page.get_by_role('button', name='Guardar preferências', exact=True).is_visible():
            page.get_by_role('button', name='Gerir preferências', exact=True).click()

    try:
        page.goto(opts.base + '/contactos', wait_until='networkidle')
        page.get_by_role('button', name='Ativar e mostrar mapa', exact=True).scroll_into_view_if_needed()
        check('maps_blocked_before_consent', frames() == 0 and not maps_requested('initial'))
        check('chat_blocked_before_consent', not any('abacus.ai' in (r['host'] or '') for r in requests))
        page.get_by_role('button', name='Recusar opcionais', exact=True).click()
        page.wait_for_timeout(400)
        check('reject_saves_false', pref()['functional'] is False and pref()['analytics'] is False and pref()['marketing'] is False)
        check('maps_blocked_after_reject', frames() == 0)
        stage = 'personalize-off'
        open_settings()
        check('optional_switches_initially_off', page.get_by_role('switch', name='Funcionais', exact=True).get_attribute('aria-checked') == 'false')
        page.get_by_role('button', name='Guardar preferências', exact=True).click()
        check('personalize_off_no_map', frames() == 0)
        stage = 'personalize-on'
        open_settings()
        page.get_by_role('switch', name='Funcionais', exact=True).click()
        page.get_by_role('button', name='Guardar preferências', exact=True).click()
        page.locator('iframe[title^="Mapa com"]').wait_for(state='attached')
        page.locator('iframe[title^="Mapa com"]').scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        check('personalize_only_functional', pref()['functional'] is True and pref()['analytics'] is False and pref()['marketing'] is False)
        check('maps_requested_after_functional_consent', maps_requested(stage))
        check('chat_available_with_functional_consent', page.locator('script[src*="abacus.ai"]').count() > 0)
        check('map_referrer_minimized', page.locator('iframe[title^="Mapa com"]').get_attribute('referrerpolicy') == 'no-referrer')
        stage = 'withdraw'
        open_settings()
        page.get_by_role('switch', name='Funcionais', exact=True).click()
        page.get_by_role('button', name='Guardar preferências', exact=True).click()
        page.wait_for_timeout(1800)
        check('withdraw_stops_map', frames() == 0 and pref()['functional'] is False)
        check('withdraw_reloads_away_executed_chat', page.locator('script[src*="abacus.ai"]').count() == 0)
        stage = 'withdraw-reload'
        page.reload(wait_until='networkidle')
        check('withdraw_persists_after_reload', frames() == 0 and pref()['functional'] is False and not maps_requested(stage))
        check('saved_choice_hides_initial_banner_after_hydration', page.get_by_role('dialog').count() == 0)
        check('chat_stays_off_after_withdraw', not any(r['stage'] == stage and 'abacus.ai' in (r['host'] or '') for r in requests))
        stage = 'accept-all'
        open_settings()
        page.get_by_role('button', name='Aceitar todos', exact=True).click()
        page.locator('iframe[title^="Mapa com"]').wait_for(state='attached')
        check('accept_all_saved', all(pref()[k] is True for k in ['functional', 'analytics', 'marketing']))
        page.set_viewport_size({'width': 390, 'height': 844})
        open_settings()
        check('preferences_mobile_no_overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        page.get_by_role('button', name='Recusar opcionais', exact=True).click()
        page.wait_for_timeout(1600)
        check('reject_after_accept_revokes', frames() == 0 and pref()['functional'] is False)
        stage = 'malformed-consent'
        page.evaluate('(key) => localStorage.setItem(key, JSON.stringify({version:2, necessary:true, functional:"false", analytics:false, marketing:false, updatedAt:new Date().toISOString()}))', opts.key)
        page.reload(wait_until='networkidle')
        check('malformed_consent_fails_closed', frames() == 0 and not maps_requested(stage))
        stage = 'legacy-consent'
        page.evaluate('(key) => { localStorage.removeItem(key); localStorage.setItem("nv-cookie-consent-v1", JSON.stringify({necessary:true, functional:true, analytics:false, marketing:false, updatedAt:new Date().toISOString()})) }', opts.key)
        page.reload(wait_until='networkidle')
        check('legacy_purpose_not_reused_for_new_chat_consent', frames() == 0 and not maps_requested(stage))
    except Exception as error:
        result['error'] = type(error).__name__
        result['failed_stage'] = stage
    finally:
        result['external_domains'] = {host: sum(1 for r in requests if r['host'] == host) for host in sorted({r['host'] for r in requests if r['host']})}
        result['network_by_stage'] = requests
        result['passed'] = sum(result['tests'].values())
        result['total'] = len(result['tests'])
        target = Path(opts.output); target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf8')
        print(json.dumps({'passed': result['passed'], 'total': result['total'], 'failed': [k for k,v in result['tests'].items() if not v], 'error': result.get('error'), 'stage': result.get('failed_stage')}, ensure_ascii=False))
        browser.close()
