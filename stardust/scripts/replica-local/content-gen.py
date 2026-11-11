# Re-author the live Prismic slice DOM of a content page into clean module markup (content.css classes).
import re, sys, html
from lxml import html as LH
ROOT='/workspace/80b77690/'
W=ROOT+'stardust/.work/replica/'
slug=sys.argv[1] if len(sys.argv)>1 else 'company'
src=open(W+'content-main.html',encoding='utf8').read()
css=open(W+'content-sc.css',encoding='utf8').read().split('\n')
# ---- rule table: hash -> {'': {prop:val}, 'sp':{}, 'pc':{}} for simple `.hash { }` rules
R={}
for l in css:
    m=re.match(r'(?:@media \(((?:max|min)-width): (\d+)px\) \{ )?\.([A-Za-z0-9_-]+) \{ (.*?) \}',l)
    if not m: continue
    med='' if not m.group(1) else ('sp' if m.group(1)=='max-width' else 'pc')
    d=R.setdefault(m.group(3),{}).setdefault(med,{})
    for decl in m.group(4).split(';'):
        if ':' in decl:
            k,v=decl.split(':',1); d[k.strip()]=v.strip()
SVGROT={}
for l in css:
    m=re.match(r'\.([A-Za-z0-9_-]+) \.sc-hCcPtG > svg \{ transform: rotate\(([-\d]+deg)\); \}',l)
    if m: SVGROT[m.group(1)]=m.group(2)
def get(h,med,p): return R.get(h,{}).get(med,{}).get(p)
def hashes(el): return [c for c in (el.get('class') or '').split() if c in R]
def comp(el):
    m=re.search(r'\b([A-Z][A-Za-z]+)__([A-Za-z]+)-sc',el.get('class') or ''); return (m.group(1),m.group(2)) if m else (None,None)
def style(d):
    d={k:v for k,v in d.items() if v not in (None,'')}
    return (' style="'+';'.join(f'{k}:{v}'.replace('"',"'") for k,v in d.items())+'"') if d else ''
INSCOPE={'/','/about-axa','/about-insurance','/company','/customer','/customer-feedback','/dataprivacy','/product','/prospect','/recruitment/career'}
def href(u):
    if u.startswith('/') and not u.startswith('//'):
        path=u.split('?')[0].split('#')[0].rstrip('/') or '/'
        if path not in INSCOPE: return 'https://www.axa.co.jp'+u
    return u
warn=[]
# ---- inline content sanitiser (content markup kept verbatim: p strong b em br a span.white-txt/turquoise-txt)
KEEP_SPAN={'white-txt','turquoise-txt','txt-white'}
def inline(el):
    out=html.escape(el.text or '',quote=False)
    for ch in el:
        out+=node(ch)+html.escape(ch.tail or '',quote=False)
    return out
def node(el):
    t=el.tag
    if t in ('strong','b','em','i','u','sup','sub','small'): return f'<{t}>{inline(el)}</{t}>'
    if t=='br': return '<br>'
    if t=='p': return f'<p>{inline(el)}</p>'
    if t=='a':
        a=f' href="{html.escape(href(el.get("href","")))}"'+(f' target="{el.get("target")}"' if el.get('target') and el.get('target')!='_self' else '')
        return f'<a{a}>{inline(el)}</a>'
    if t=='span':
        k=[c for c in (el.get('class') or '').split() if c in KEEP_SPAN]
        return (f'<span class="{k[0]}">{inline(el)}</span>' if k else inline(el))
    if t in ('div',): return inline(el)
    if t in ('ul','ol','li'): return f'<{t}>{inline(el)}</{t}>'
    warn.append('inline tag '+t); return inline(el)
def ps(el):
    # the authored rich text: every <p>/<ul> under el, in order
    blocks=[x for x in el.iter('p','ul','ol') if not any(a.tag in ('p','ul','ol') for a in x.iterancestors())]
    return ''.join(node(b) for b in blocks)
def svg(el):
    s=el.find('.//svg')
    if s is None: return ''
    t=LH.tostring(s,encoding='unicode')
    return re.sub(r' class="[^"]*"','',t).replace('<svg ','<svg aria-hidden="true" ',1)
# ---- modules
def media(el):
    h=hashes(el)[0]
    st={'--jc':get(h,'pc','justify-content'),'--jc-sp':get(h,'sp','justify-content')}
    imgs=''
    for im in el.iter('img'):
        cls=im.get('class')
        v='pc' if 'PcImage' in cls else 'sp'
        ih=[c for c in hashes(im) if get(c,'','padding-left')]
        pl=get(ih[0],'','padding-left') if ih else None
        alt=html.escape(im.get('alt') or '')
        imgs+=f'<img class="slice-media__img slice-media__img--{v}" src="{html.escape(im.get("src"))}" alt="{alt}"'+(style({'--img-pl':pl}) if pl and pl!='0px' else '')+'>'
    a=el.find('a')
    if a is not None: imgs=f'<a class="slice-media__link" href="{html.escape(href(a.get("href")))}">{imgs}</a>'
    return f'<div class="slice-media"{style(st)}>{imgs}</div>'
def text(el):
    h=hashes(el)[0]
    st={}
    for med,suf in (('pc',''),('sp','-sp')):
        st['--ta'+suf]=get(h,med,'text-align'); st['--pl'+suf]=get(h,med,'padding-left'); st['--fs'+suf]=get(h,med,'font-size')
    if st['--ta-sp']==st['--ta']: st['--ta-sp']=None
    if st['--pl-sp']==st['--pl']: st['--pl-sp']=None
    if st['--fs-sp']==st['--fs']: st['--fs-sp']=None
    if st['--ta']=='left': st['--ta']=None
    if st['--pl']=='0px': st['--pl']=None
    return f'<div class="slice-text"{style(st)}>{ps(el)}</div>'
def heading(el):
    h=hashes(el)[0]
    fs=None
    for l in css:
        m=re.match(r'\.'+h+r' \.slice-heading-inner \{ .*font-size: ([^;]+);',l)
        if m: fs=m.group(1)
    anc=el.find('.//div[@class="slice-anchor"]')
    a=f'<span class="slice-anchor" id="{anc.get("id")}"></span>' if anc is not None and anc.get('id') else ('<span class="slice-anchor"></span>' if anc is not None else '')
    inner=''.join(inline(p) for p in el.iter('p'))
    bord=' slice-heading__text--bordered' if 'BorderedTitleSlice' in LH.tostring(el,encoding='unicode') else ''
    return f'<{el.tag} class="slice-heading"{style({"--fs":fs})}>{a}<span class="slice-heading__inner"><span class="slice-heading__text{bord}">{inner}</span></span></{el.tag}>'
def hr(el):
    h=hashes(el)[0]; m=get(h,'','margin')
    bc=get(h,'','border-color') or ''
    parts=re.findall(r'rgba?\([^)]*\)|[a-z]+',bc)
    col=parts[2] if len(parts)>=3 and parts[2]!='transparent' else None
    return f'<hr class="slice-rule"{style({"--hr-m":m.split()[0] if m else None,"--hr-color":col})}>'
def linkbuttons(el):
    out=''
    for ch in el:
        c,s=comp(ch)
        if s=='StyledDirectButton':
            a=ch.find('.//a')
            out+=f'<a class="anchor-btn" href="{html.escape(href(a.get("href")))}"><span class="anchor-btn__label">{ps(a)}</span><span class="anchor-btn__icon">{svg(a)}</span></a>'
        elif s=='EmptyItem': out+='<span class="anchor-buttons__empty" aria-hidden="true"></span>'
        else: warn.append('linkbuttons child '+str(s))
    return f'<nav class="anchor-buttons">{out}</nav>'
def custombutton(el):
    h=hashes(el)[0]
    st={'--ta':get(h,'pc','text-align'),'--ta-sp':get(h,'sp','text-align'),'--rot':SVGROT.get(h)}
    if st['--ta-sp']==st['--ta']: st['--ta-sp']=None
    if st['--rot']=='0deg': st['--rot']=None
    wr=[d for d in el.iter('div') if comp(d)[0]=='HpButton'][0]
    fs=None
    for l in css:
        m=re.match(r'\.'+(wr.get('class').split()[-1])+r' \.custom-button \{ font-size: ([^;]+);',l)
        if m: fs=m.group(1)
    a=wr.find('.//a')
    var='primary' if any(get(c,'','background-color')=='rgb(0, 0, 143)' for c in hashes(a)) else 'secondary'
    lab=[s for s in a.iter('span') if comp(s)==('HpButton','ButtonLabel')]
    badge=f'<span class="hp-btn__badge">{html.escape(lab[0].text_content())}</span>' if lab else ''
    txt=ps(a)
    tgt=f' target="{a.get("target")}"' if a.get('target') and a.get('target')!='_self' else ''
    return (f'<div class="cta-button"{style(st)}><a class="hp-btn hp-btn--{var}" href="{html.escape(href(a.get("href")))}"{tgt}'
            f'{style({"--fs":fs if fs!="0.9975rem" else None})}><span class="hp-btn__label">{txt}{badge}</span><span class="hp-btn__icon">{svg(a)}</span></a></div>')
def customlink(el):
    h=hashes(el)[0]; a=el.find('.//a')
    st={'--jc':get(h,'','justify-content'),'--pl':get(h,'','padding-left'),'--fs':get(h,'','font-size')}
    if st['--jc']=='flex-start': st['--jc']=None
    if st['--pl']=='0px': st['--pl']=None
    if st['--fs']=='0.9975rem': st['--fs']=None
    plain=' custom-link__a--plain' if not any(get(c,'','color') for c in hashes(a)) else ''
    return f'<div class="custom-link"{style(st)}><a class="custom-link__a{plain}" href="{html.escape(href(a.get("href")))}">{ps(a)}</a></div>'
def listmod(el):
    ul=el if el.tag=='ul' else el.find('.//ul')
    items=''.join(f'<li>{ps(li)}</li>' for li in ul.findall('li'))
    return f'<ul class="note-list">{items}</ul>'
def grid(el):
    cols=''
    for c in el:
        m={k:v for k,v in re.findall(r'\b(lg|md|sm)-col-(\d+)',c.get('class') or '')}
        st={f'--{k}':v+'%' for k,v in m.items()}
        full=' grid__col--sm-full' if m.get('sm')=='100' else ''
        cols+=f'<div class="grid__col{full}"{style(st)}>'+''.join(slice_(s) for s in c)+'</div>'
    return f'<div class="grid">{cols}</div>'
def module(el):
    if el.tag in ('h1','h2','h3','h4') and comp(el)[0]=='Heading': return heading(el)
    if el.tag=='hr': return hr(el)
    if 'row' in (el.get('class') or '').split(): return grid(el)
    c,s=comp(el)
    if c=='Text': return text(el)
    if c=='Media': return media(el)
    if c=='LinkButtons': return linkbuttons(el)
    if c=='CustomButton': return custombutton(el)
    if c=='CustomLink': return customlink(el)
    if el.tag=='div' and not el.get('class') and el.find('ul') is not None: return listmod(el)
    warn.append(f'unknown module {el.tag} {el.get("class")}'); return ''
def slice_(el):
    return '<div class="slice">'+''.join(module(m) for m in el)+'</div>'
def band(el):
    h=hashes(el)[0]
    st={'--band-pad':get(h,'','padding'),'--band-bg':get(h,'','background-color')}
    b=get(h,'','border') or ''
    if 'border-width' in R[h]['']: b='none'
    st['--band-border']=b
    img=get(h,'','background-image'); img_sp=get(h,'sp','background-image')
    if img and img!='url("")': st['--band-img']=img
    if img_sp: st['--band-img-sp']=img_sp
    if st['--band-pad'] in ('0px',): st['--band-pad']=None
    if st['--band-bg']=='transparent': st['--band-bg']=None
    if st['--band-border']=='2px solid transparent': st['--band-border']=None
    return f'<section class="band"{style(st)}>'+''.join(slice_(s) for s in el)+'</section>'
def top(el):
    c,s=comp(el)
    if s=='BackgroundWrapper': return band(el)
    if s=='OuterBackground':
        inner=el[0]
        return '<div class="band-outer"><div class="band-outer__inner">'+''.join(top(x) for x in inner)+'</div></div>'
    if s=='BreadcrumbWrapper':
        lis=''
        for li in el.iter('li'):
            a=li.find('a')
            if a is not None: lis+=f'<li><a href="{html.escape(href(a.get("href")))}">{html.escape(a.text_content())}</a><span class="breadcrumbs__sep" aria-hidden="true">&gt;</span></li>'
            else: lis+=f'<li aria-current="page">{html.escape(li.text_content())}</li>'
        return f'<nav class="breadcrumbs" aria-label="パンくずリスト"><ol class="breadcrumbs__list">{lis}</ol></nav>'
    warn.append('unknown top '+str(el.get('class'))); return ''
doc=LH.fromstring(src)
fb=doc.find('.//div[@class="flexbox"]')
body='\n'.join(top(x) for x in fb)
# head
head=open(W+'content-head.txt',encoding='utf8').read().split('\n')
title=head[0]; metas=[]
for l in head[1:]:
    if l and l not in metas: metas.append(l)
P=ROOT+'stardust/prototypes/'
header=open(P+'canon/header.html',encoding='utf8').read()
footer=open(P+'canon/footer.html',encoding='utf8').read()
rail=open(P+'canon/rail.html',encoding='utf8').read()
btt=re.search(r'<button class="back-to-top".*?</button>',rail,re.S).group(0)
out=f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
{chr(10).join(metas)}
<link rel="icon" href="https://www.axa.co.jp/favicon/favicon.ico">
<link rel="preload" href="fonts/noto-sans-jp-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/noto-sans-jp-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="canon/canon.css">
<link rel="stylesheet" href="content.css">
<link rel="stylesheet" href="{slug}.css">
<script src="canon/chrome.js" defer></script>
</head>
<body>
{header.strip()}
<main>
{btt}
<div class="content-page">
{body}
</div>
</main>
{footer.strip()}
</body>
</html>
'''
open(P+f'{slug}-proposed.html','w',encoding='utf8').write(out)
print('written',len(out),'warnings',sorted(set(warn)))
