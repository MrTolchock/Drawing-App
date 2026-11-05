from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader, simpleSplit
import fitz, json

ROOT=Path('/workspace/design-plans/heart-tree')
W,H=landscape(A4)
INK=colors.HexColor('#29432e')
PAPER=colors.HexColor('#f7f2e7')
MUTED=colors.HexColor('#747365')
GOLD=colors.HexColor('#c5a153')
out=ROOT/'DESIGN-REVIEW.pdf'
c=canvas.Canvas(str(out),pagesize=(W,H))
c.setTitle('Farbtupf: Heart Tree design review')
c.setAuthor('Farbtupf design planning')

def background(label,page):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(GOLD);c.setLineWidth(.7);c.line(35,35,W-35,35)
    c.setFillColor(MUTED);c.setFont('Helvetica',9)
    c.drawString(38,21,label)
    c.drawRightString(W-38,21,str(page))

def title(text,y,size=24):
    c.setFillColor(INK);c.setFont('Times-Bold',size);c.drawString(48,y,text)

def paragraph(text,x,y,width,size=12,leading=18):
    c.setFillColor(INK);c.setFont('Helvetica',size)
    for line in simpleSplit(text,'Helvetica',size,width):
        c.drawString(x,y,line);y-=leading
    return y

background('Design review | Application unchanged | Child observation pending',1)
title('Farbtupf - Der Herzbaum',H-65,34)
title('Die vergessenen Pfade',H-104,25)
paragraph('A connected Swiss woodland, a fox to guide, and short helping quests.',48,H-140,W-96,15,21)
title('The chosen adventure',H-208,20)
paragraph('Five clearings form a loop around the Heart Tree. The fox reconnects neighbours and shared places through Meet, Reconnect and Gather. The first quest reopens a crossing between Beaver and Brown Hare.',48,H-235,344,13,20)
title('Understand before reading',H-208,20) if False else None
c.setFillColor(INK);c.setFont('Times-Bold',20);c.drawString(448,H-208,'Understand before reading')
paragraph('The player is 6-7 and initially cannot read. Pictures, short spoken actions, demonstrations and fresh attempts explain the task. Reading ability and subject difficulty stay independent.',448,H-235,340,13,20)
c.setFillColor(INK);c.setFont('Times-Bold',20);c.drawString(48,213,'Room for many puzzles')
paragraph('Ten story milestones organise growing quest collections. Fifteen activity places can host many episodes and new puzzle families. The 120-episode example illustrates capacity; that content has not been authored.',48,187,344,12,18)
c.setFont('Times-Bold',20);c.drawString(448,213,'A concrete next build')
paragraph('The proposed local Three.js slice includes the tree, brook, garden, fox movement, two neighbours, beginner guidance, one flat activity, a correct return and a persistent bridge payoff.',448,187,340,12,18)
paragraph('This pack consolidates design direction. No app implementation, child observation or production voice recording has been performed.',48,74,W-96,11,16)
c.showPage()

boards=[
 ('World and story','adventure-blueprint-v2.png'),
 ('The selected opening','opening-storyboard.png'),
 ('Capacity for a growing library','puzzle-library.png'),
 ('Guidance before reading','before-reading-storyboard.png'),
 ('The child interface','child-interface.png'),
 ('Picture-only reference interactions','walkthrough-preview.png'),
]
for number,(heading,filename) in enumerate(boards,start=2):
    background('Concept design | Not an implemented application',number)
    title(heading,H-37,20)
    path=ROOT/filename
    reader=ImageReader(str(path))
    iw,ih=reader.getSize()
    scale=min((W-46)/iw,(H-90)/ih)
    pw,ph=iw*scale,ih*scale
    c.drawImage(reader,(W-pw)/2,49+(H-90-ph)/2,width=pw,height=ph,mask='auto')
    c.showPage()

background('Implementation remains a future scope decision',8)
title('From design to the first playable slice',H-60,29)
y=H-103
y=paragraph('The next concrete implementation is small enough to review as a complete experience:',48,y,W-96,14,21)-12
items=[
 'A native woodland scene with actual 3D terrain and character silhouettes.',
 'Tap/click walking, a fixed angled camera and one current pictured goal.',
 'The bridge request, one guided existing flat activity and a pictured return.',
 'Story completion independent of whether a new learning star is earned.',
 'A bridge that becomes usable and stays repaired after reload.',
 'Preservation of existing progress, artwork, stickers and learning-stage identities.',
]
for item in items:
    c.setFillColor(GOLD);c.circle(54,y+3,2.4,fill=1,stroke=0)
    y=paragraph(item,68,y,W-118,12,17)-9
y-=6
c.setFillColor(INK);c.setFont('Times-Bold',19);c.drawString(48,y,'Evidence still to collect')
y=paragraph('Actual child understanding, target-device interaction, final 3D art quality and reliable offline voice guidance need validation. The 22-group readiness matrix specifies the instruction work; it does not certify the exercises.',48,y-25,W-96,12,18)-17
c.setFont('Times-Bold',19);c.drawString(48,y,'Implementation boundary')
paragraph('The original instruction to keep the app unbuilt remains active. Starting the local slice is the next substantial scope decision. Deployment and publication are outside that first build scope.',48,y-25,W-96,12,18)
c.showPage()
c.save()

document=fitz.open(out)
assert len(document)==8
document[0].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(ROOT/'design-review-cover.png')
document[7].get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False).save(ROOT/'design-review-scope.png')
print(json.dumps({'review_pdf':str(out),'pages':len(document),'bytes':out.stat().st_size,'all_board_sources_present':all((ROOT/f).exists() for _,f in boards)}))
document.close()

