"""Read-only public checks. Submission probes contain no valid contact or clinical data."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
import httpx

root=Path(__file__).resolve().parents[1]
base='https://desafiosalutar.pt'
class Visible(HTMLParser):
    def __init__(self): super().__init__(); self.skip=0; self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'): self.skip+=1
    def handle_endtag(self,tag):
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if not self.skip:self.parts.append(data)
def visible(html):
    p=Visible();p.feed(html);return re.sub(r'\s+',' ',' '.join(p.parts)).strip()
out={'base':base,'production_data_changes':False,'pages':{},'legal_config_matches':{},'api_probes':{}}
with httpx.Client(timeout=35,follow_redirects=False,trust_env=False) as c:
    for path in ['/informacao-legal','/politica-privacidade','/contactos','/produtos','/pedido-recomendacao']:
        r=c.get(base+path); text=visible(r.text)
        out['pages'][path]={'status':r.status_code,'no_placeholder_markers':not any(x in text for x in ['a confirmar pelo cliente','a indicar pelo cliente','[Capital','[CAE','[Centro']),'no_frame_header':r.headers.get('x-frame-options'),'referrer_policy':r.headers.get('referrer-policy')}
        if path=='/informacao-legal':
            config=(root/'lib/site.ts').read_text(encoding='utf8')
            for key in ['legalName','fullAddress','nif','registry','capital','cae','email','phone','mobilePhone']:
                match=re.search(r'^\s*'+key+r":\s*'([^']*)'",config,re.M)
                out['legal_config_matches'][key]=bool(match) and re.sub(r'\s+',' ',match[1]) in text
        if path=='/pedido-recomendacao': out['advice_page']={'whatsapp_present':'Falar no WhatsApp' in text,'no_health_fields':not re.search(r'<(?:input|textarea|form)\b',r.text),'privacy_warning':'Não envie sintomas' in text}
    for label,kwargs in [
        ('empty',{'content':b''}),
        ('cross_origin',{'content':b'audit-invalid','headers':{'Origin':'https://example.invalid','Content-Type':'text/plain'}}),
        ('invalid_multipart',{'files':{'audit':(None,'synthetic-audit-probe')}}),
    ]:
        kwargs.setdefault('headers',{'Origin':base})
        r=c.post(base+'/api/recomendacao',**kwargs)
        out['api_probes'][label]={'status':r.status_code,'no_store':'no-store' in r.headers.get('cache-control',''),'no_redirect':'location' not in r.headers}
    for path in ['/api/admin','/api/admin/messages','/api/admin/attachments?id=audit-invalid']:
        r=c.get(base+path)
        out['api_probes'][path]={'unauthenticated_status':r.status_code,'no_store':'no-store' in r.headers.get('cache-control','')}
        r=c.get(base+path,headers={'Cookie':'ds-admin=audit-invalid'})
        out['api_probes'][path]['forged_session_status']=r.status_code
    r=c.post(base+'/api/admin',headers={'Origin':'https://example.invalid'},json={'action':'login','password':'audit-invalid-not-a-real-credential'})
    out['api_probes']['admin_cross_origin_status']=r.status_code
target=root/'audit/2026-10-22/before-live-http.json'
target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf8')
print(json.dumps(out,ensure_ascii=False))
