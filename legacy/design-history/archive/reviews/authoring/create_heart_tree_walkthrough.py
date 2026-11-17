from pathlib import Path
import json, math
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import fitz

OUT = Path('/workspace/design-plans/heart-tree')
SCRATCH = Path('/workspace/scratch/heart-tree-walkthrough')
OUT.mkdir(parents=True, exist_ok=True)
SCRATCH.mkdir(parents=True, exist_ok=True)
W, H = landscape(A4)
INK = colors.HexColor('#29432e')
PAPER = colors.HexColor('#f7f2e7')
CARD = colors.HexColor('#fffaf0')
LINE = colors.HexColor('#b8b09a')
GOLD = colors.HexColor('#d5ad4c')
MUTED = colors.HexColor('#777568')
FONT = 'Helvetica'
BOLD = 'Helvetica-Bold'

try:
    from fontTools.ttLib import TTFont as FontToolsFont
    for source, target, name in [
        ('andika-400.woff2','Andika-Regular.ttf','Andika'),
        ('andika-700.woff2','Andika-Bold.ttf','AndikaBold')
    ]:
        font = FontToolsFont('/workspace/Drawing-App/fonts/' + source)
        font.flavor = None
        path = SCRATCH / target
        font.save(str(path))
        pdfmetrics.registerFont(TTFont(name, str(path)))
    FONT, BOLD = 'Andika', 'AndikaBold'
except Exception as error:
    print('Using standard PDF fonts:', type(error).__name__)

def rounded(c, x, y, w, h, fill=CARD, line=LINE, dash=False, radius=18):
    c.saveState()
    c.setFillColor(fill)
    c.setStrokeColor(line)
    c.setLineWidth(1.5)
    if dash:
        c.setDash(6, 5)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    c.restoreState()

def leaf(c, x, y, size):
    c.saveState()
    c.translate(x, y)
    c.scale(size / 35, size / 35)
    c.setFillColor(colors.HexColor('#71994a'))
    c.setStrokeColor(colors.HexColor('#3d672d'))
    c.setLineWidth(1.3)
    p = c.beginPath()
    p.moveTo(0, -30)
    p.curveTo(-4, -22, -17, -25, -14, -15)
    p.curveTo(-31, -17, -28, -3, -18, -2)
    p.curveTo(-35, 7, -27, 19, -15, 14)
    p.curveTo(-21, 31, -8, 36, -2, 26)
    p.curveTo(3, 45, 19, 37, 12, 24)
    p.curveTo(28, 30, 34, 15, 20, 11)
    p.curveTo(37, 4, 29, -9, 17, -7)
    p.curveTo(27, -22, 10, -27, 4, -22)
    p.curveTo(2, -26, 1, -28, 0, -30)
    c.drawPath(p, fill=1, stroke=1)
    c.setStrokeColor(colors.HexColor('#d6d5a0'))
    c.setLineWidth(1.2)
    c.line(0, -34, 6, 30)
    for a, b, dx in [(-17,-5,-15),(-4,8,-18),(9,20,-12)]:
        c.line(2 + a / 10, a, dx, b)
    c.restoreState()

def nut(c, x, y, size):
    c.saveState()
    c.translate(x, y)
    c.scale(size / 32, size / 32)
    c.setFillColor(colors.HexColor('#b47b3d'))
    c.setStrokeColor(colors.HexColor('#75512e'))
    c.setLineWidth(1.4)
    p = c.beginPath()
    p.moveTo(0, 30)
    p.curveTo(18, 23, 27, 8, 24, -9)
    p.curveTo(21, -28, -18, -30, -25, -10)
    p.curveTo(-30, 6, -18, 24, 0, 30)
    c.drawPath(p, fill=1, stroke=1)
    c.setStrokeColor(colors.HexColor('#e1b773'))
    c.setLineWidth(3)
    c.bezier(-9, 20, -16, 6, -15, -8, -8, -19)
    c.setStrokeColor(colors.HexColor('#d0a067'))
    c.setLineWidth(1)
    c.bezier(5, 22, 11, 8, 14, -8, 8, -20)
    c.restoreState()

def berry(c, x, y, size):
    c.saveState()
    c.translate(x, y)
    c.scale(size / 32, size / 32)
    c.setFillColor(colors.HexColor('#c45945'))
    c.setStrokeColor(colors.HexColor('#924637'))
    p = c.beginPath()
    p.moveTo(0, -30)
    p.curveTo(-12, -15, -30, 1, -24, 18)
    p.curveTo(-18, 32, 19, 32, 25, 17)
    p.curveTo(29, 1, 14, -19, 0, -30)
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(colors.HexColor('#507f3d'))
    for angle in [0,72,144,216,288]:
        a = math.radians(angle)
        p = c.beginPath()
        p.moveTo(0, 23)
        p.lineTo(18*math.sin(a), 23 + 12*math.cos(a))
        p.lineTo(4*math.sin(a+0.5), 23+3*math.cos(a+0.5))
        p.close()
        c.drawPath(p, fill=1, stroke=0)
    c.setFillColor(colors.HexColor('#efdaa2'))
    for sx, sy in [(-12,11),(0,12),(12,10),(-8,-2),(7,-2),(0,-14)]:
        c.ellipse(sx-1, sy-2, sx+1, sy+2, fill=1, stroke=0)
    c.restoreState()

def acorn(c, x, y, size):
    c.saveState()
    c.translate(x, y)
    c.scale(size / 32, size / 32)
    c.setStrokeColor(colors.HexColor('#725033'))
    c.setFillColor(colors.HexColor('#b48951'))
    p = c.beginPath()
    p.moveTo(-18,12)
    p.curveTo(-19,-7,-10,-22,0,-28)
    p.curveTo(12,-22,20,-6,18,12)
    p.close()
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(colors.HexColor('#756640'))
    c.roundRect(-22,8,44,16,6,fill=1,stroke=1)
    c.setLineWidth(3)
    c.line(0,24,4,34)
    c.restoreState()

def stone(c, x, y, size):
    c.saveState()
    c.translate(x,y)
    c.scale(size/32,size/32)
    c.setFillColor(colors.HexColor('#a5aba0'))
    c.setStrokeColor(colors.HexColor('#70796b'))
    p=c.beginPath()
    p.moveTo(-27,-7)
    p.curveTo(-30,7,-13,24,3,23)
    p.curveTo(24,23,34,2,25,-14)
    p.curveTo(13,-26,-18,-24,-27,-7)
    c.drawPath(p,fill=1,stroke=1)
    c.setStrokeColor(colors.HexColor('#d5d9cc'))
    c.line(-15,8,3,15)
    c.restoreState()

ICONS = {'leaf':leaf,'nut':nut,'berry':berry,'acorn':acorn,'stone':stone}

def speaker(c,x,y,r=26):
    c.saveState()
    c.setFillColor(CARD); c.setStrokeColor(INK); c.setLineWidth(1.7)
    c.circle(x,y,r,fill=1,stroke=1)
    c.setFillColor(INK)
    p=c.beginPath()
    p.moveTo(x-13,y-5);p.lineTo(x-7,y-5);p.lineTo(x+1,y-12)
    p.lineTo(x+1,y+12);p.lineTo(x-7,y+5);p.lineTo(x-13,y+5);p.close()
    c.drawPath(p,fill=1,stroke=0)
    c.setLineWidth(2)
    c.arc(x-3,y-10,x+15,y+10,-65,130)
    c.arc(x-3,y-16,x+23,y+16,-65,130)
    c.restoreState()

def eye(c,x,y,r=26):
    c.saveState()
    c.setFillColor(CARD);c.setStrokeColor(INK);c.setLineWidth(1.7)
    c.circle(x,y,r,fill=1,stroke=1)
    p=c.beginPath();p.moveTo(x-19,y)
    p.curveTo(x-8,y+15,x+8,y+15,x+19,y)
    p.curveTo(x+8,y-15,x-8,y-15,x-19,y)
    c.drawPath(p,fill=0,stroke=1)
    c.setFillColor(INK);c.circle(x,y,6,fill=1,stroke=0)
    c.restoreState()

def basket(c,x,y,r=43):
    c.saveState()
    c.setFillColor(CARD);c.setStrokeColor(INK);c.setLineWidth(1.7)
    c.circle(x,y,r,fill=1,stroke=1)
    c.setFillColor(colors.HexColor('#bd9360'))
    p=c.beginPath();p.moveTo(x-26,y+7);p.lineTo(x+26,y+7)
    p.lineTo(x+19,y-22);p.lineTo(x-19,y-22);p.close()
    c.drawPath(p,fill=1,stroke=1)
    c.setLineWidth(3)
    c.arc(x-20,y-2,x+20,y+32,0,180)
    c.line(x-29,y+9,x+29,y+9)
    c.setLineWidth(1)
    for dx in [-12,0,12]:c.line(x+dx,y+4,x+dx*.75,y-17)
    c.line(x-22,y-5,x+22,y-5)
    c.line(x-20,y-13,x+20,y-13)
    c.restoreState()

def arrow(c,x1,y1,x2,y2):
    c.saveState();c.setStrokeColor(GOLD);c.setFillColor(GOLD);c.setLineWidth(3)
    c.line(x1,y1,x2,y2)
    a=math.atan2(y2-y1,x2-x1)
    p=c.beginPath();p.moveTo(x2,y2)
    p.lineTo(x2-13*math.cos(a-.4),y2-13*math.sin(a-.4))
    p.lineTo(x2-13*math.cos(a+.4),y2-13*math.sin(a+.4));p.close()
    c.drawPath(p,fill=1,stroke=0);c.restoreState()

def base(c,label):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    rounded(c,30,42,W-60,H-72,fill=CARD,radius=25)
    c.setFont(FONT,8);c.setFillColor(MUTED)
    c.drawString(42,21,label+'  |  Adult footer: cover during the walkthrough')

def quantity_points(n,arrangement):
    if arrangement=='row':
        return [(i-(n-1)/2,0) for i in range(n)]
    return {1:[(0,0)],2:[(0,.55),(0,-.55)],3:[(-.55,.4),(.55,.4),(0,-.6)]}[n]

def draw_quantity_group(c,cx,cy,n,arrangement='row',spacing=68,size=29):
    for dx,dy in quantity_points(n,arrangement):
        nut(c,cx+dx*spacing,cy+dy*spacing,size)

def quantity_page(c, spec):
    base(c,spec['id'])
    rounded(c,W/2-225,340,450,155,line=GOLD)
    draw_quantity_group(c,W/2,418,spec['target'],'row',spacing=82,size=32)
    centers=[W/2-150,W/2+150]
    for x,n in zip(centers,spec['choices']):
        rounded(c,x-120,132,240,165)
        draw_quantity_group(c,x,214,n,'group',spacing=69,size=29)
    speaker(c,77,83)
    if spec.get('demo'):
        arrow(c,W/2,326,centers[spec['correct']],311)

def pattern_page(c,spec):
    base(c,spec['id'])
    xs=[W/2+(i-2)*128 for i in range(5)]
    for x,item in zip(xs,spec['sequence']):
        rounded(c,x-54,344,108,122,dash=item is None,line=INK if item is None else LINE)
        if item:ICONS[item](c,x,404,36)
    centers=[W/2-120,W/2+120]
    for x,item in zip(centers,spec['choices']):
        rounded(c,x-80,132,160,150)
        ICONS[item](c,x,207,45)
    speaker(c,77,83)
    if spec.get('demo'):
        arrow(c,centers[spec['correct']],295,xs[-1],332)

def memory_page(c,spec):
    base(c,spec['id'])
    xs=[W/2-195,W/2,W/2+195]
    hidden=spec['mode']=='hidden'
    for i,(x,item) in enumerate(zip(xs,spec['objects'])):
        missing=hidden and i==spec['missing']
        rounded(c,x-75,350,150,145,dash=missing,line=INK if missing else LINE)
        if not missing:ICONS[item](c,x,423,44)
    speaker(c,77,83)
    if hidden:
        for x,item in zip(xs,spec['choices']):
            rounded(c,x-75,145,150,130)
            ICONS[item](c,x,210,38)
        eye(c,W-77,83)
        if spec.get('demo'):
            arrow(c,xs[spec['correct']],287,xs[spec['missing']],338)
    else:
        basket(c,W/2,175)

cards=[
 {'id':'PATTERN-DEMO','kind':'pattern','demo':True,'sequence':['leaf','nut','leaf','nut',None],'choices':['leaf','nut'],'correct':0},
 {'id':'PATTERN-TRY-A','kind':'pattern','sequence':['nut','leaf','nut','leaf',None],'choices':['leaf','nut'],'correct':1},
 {'id':'PATTERN-TRY-B','kind':'pattern','sequence':['berry','nut','berry','nut',None],'choices':['berry','nut'],'correct':0},
 {'id':'QUANTITY-DEMO','kind':'quantity','demo':True,'target':2,'choices':[1,2],'correct':1},
 {'id':'QUANTITY-TRY-A','kind':'quantity','target':3,'choices':[3,2],'correct':0},
 {'id':'QUANTITY-TRY-B','kind':'quantity','target':2,'choices':[3,2],'correct':1},
 {'id':'MEMORY-DEMO-LOOK','kind':'memory','demo':True,'mode':'look','objects':['leaf','nut','berry'],'missing':0},
 {'id':'MEMORY-DEMO-HIDDEN','kind':'memory','demo':True,'mode':'hidden','objects':['leaf','nut','berry'],'missing':0,'choices':['leaf','acorn','stone'],'correct':0},
 {'id':'MEMORY-TRY-A-LOOK','kind':'memory','mode':'look','objects':['leaf','nut','berry'],'missing':1},
 {'id':'MEMORY-TRY-A-HIDDEN','kind':'memory','mode':'hidden','objects':['leaf','nut','berry'],'missing':1,'choices':['acorn','nut','stone'],'correct':1},
 {'id':'MEMORY-TRY-B-LOOK','kind':'memory','mode':'look','objects':['berry','leaf','nut'],'missing':0},
 {'id':'MEMORY-TRY-B-HIDDEN','kind':'memory','mode':'hidden','objects':['berry','leaf','nut'],'missing':0,'choices':['stone','acorn','berry'],'correct':2},
]

pdf=OUT/'walkthrough-cards.pdf'
c=canvas.Canvas(str(pdf),pagesize=(W,H))
c.setTitle('Farbtupf: picture-only walkthrough cards')
c.setAuthor('Farbtupf design planning')
c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
c.setFillColor(INK);c.setFont(BOLD,30)
c.drawString(54,H-90,'Picture-only walkthrough cards')
c.setFont(FONT,16)
lines=[
 'Adult cover — keep this page out of the child’s view.',
 'Use the exact spoken lines in FIRST-SESSION.md.',
 'Show one card at a time. Cover the small adult footer.',
 'Demo pages teach the rule; fresh tries have no answer cues.',
 'For memory, remove the LOOK page before showing HIDDEN.',
 'Demonstrate the speaker, basket and eye controls in context.',
 'Use one activity family per short walkthrough; take breaks freely.',
 'These are static planning cards, not a working app or a scored test.',
 'Simple native-object diagrams use the cream and forest-green palette.',
 'Final exercise selection and artwork remain for the later review.',
]
for i,line in enumerate(lines):c.drawString(54,H-145-i*29,line)
c.setFont(FONT,12);c.setFillColor(MUTED)
c.drawString(54,62,'The answer key is in the adult script, never on the child’s try cards.')
c.showPage()

for page,spec in enumerate(cards,start=2):
    spec['pdf_page']=page
    if spec['kind']=='quantity':
        assert spec['choices'][spec['correct']]==spec['target']
        quantity_page(c,spec)
    elif spec['kind']=='pattern':
        assert spec['choices'][spec['correct']]==spec['sequence'][0]
        assert spec['sequence'][:4]==[spec['sequence'][0],spec['sequence'][1],spec['sequence'][0],spec['sequence'][1]]
        pattern_page(c,spec)
    else:
        if spec['mode']=='hidden':
            assert spec['choices'][spec['correct']]==spec['objects'][spec['missing']]
            assert all(x not in spec['objects'] for i,x in enumerate(spec['choices']) if i!=spec['correct'])
        memory_page(c,spec)
    c.showPage()
c.save()

preview_pdf=OUT/'walkthrough-preview.pdf'
p=canvas.Canvas(str(preview_pdf),pagesize=(W,H))
p.setFillColor(PAPER);p.rect(0,0,W,H,fill=1,stroke=0)
p.setFillColor(INK);p.setFont(BOLD,26)
p.drawCentredString(W/2,H-47,'Three ways to understand before reading')
p.setFont(FONT,12)
p.drawCentredString(W/2,H-73,'Adult overview · the child sees one card at a time')
columns=[
 ('Quantity','Wo sind gleich viele Nüsse?',cards[4],quantity_page),
 ('Pattern','Wie geht es weiter?',cards[1],pattern_page),
 ('Missing object','Was fehlt?',cards[9],memory_page),
]
panel_width=248
scale=.286
for index,(label,voice,spec,draw) in enumerate(columns):
    x=28+index*270
    p.setFont(BOLD,19);p.setFillColor(INK)
    p.drawCentredString(x+panel_width/2,456,label)
    p.saveState();p.translate(x+3,251);p.scale(scale,scale);draw(p,spec);p.restoreState()
    p.setFont(FONT,12)
    p.drawCentredString(x+panel_width/2,228,voice)
    p.setFont(FONT,10)
    note={
      'Quantity':['Match the amount, using visible objects.','Digits are not needed for this reference.'],
      'Pattern':['Choose the next picture in the sequence.','A fresh arrangement follows the demo.'],
      'Missing object':['Remember what was shown before hiding.','The LOOK card is a separate page.']
    }[label]
    for j,line in enumerate(note):p.drawCentredString(x+panel_width/2,195-18*j,line)
p.setFont(FONT,12);p.setFillColor(INK)
p.drawCentredString(W/2,99,'See the goal → hear one action → watch an example → try → ask again')
p.setFont(FONT,10);p.setFillColor(MUTED)
p.drawCentredString(W/2,67,'Static design materials · no child observations yet · the application is unchanged')
p.showPage();p.save()

manifest={
 'purpose':'Static comprehension walkthrough; proposed reference content, not implemented exercises.',
 'font':FONT,
 'page_count':1+len(cards),
 'cards':cards,
 'reading_requirement':'No instructional reading on the child-facing card area.',
 'species_palette':['Quercus robur leaf and acorn','Corylus avellana hazelnut','Fragaria vesca fruit','stone'],
 'answers_location':'FIRST-SESSION.md (adult only)',
}
(OUT/'walkthrough-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

for src,name,page in [
 (preview_pdf,'walkthrough-preview.png',0),
 (pdf,'walkthrough-quantity-check.png',5),
 (pdf,'walkthrough-memory-check.png',10),
]:
    document=fitz.open(src)
    document[page].get_pixmap(matrix=fitz.Matrix(1.8,1.8),alpha=False).save(OUT/name)
    document.close()

document=fitz.open(pdf)
assert len(document)==13
assert all('correct' not in document[i].get_text().lower() for i in range(1,len(document)))
document.close()
print(json.dumps({'cards_pdf':str(pdf),'pages':13,'preview':str(OUT/'walkthrough-preview.png'),'font':FONT,'structural_checks':'passed; this does not establish child comprehension'},ensure_ascii=False))

