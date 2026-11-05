from pathlib import Path

import fitz
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path('/workspace/design-plans/heart-tree')
W, H = landscape(A4)
INK = colors.HexColor('#29432e')
MUTED = colors.HexColor('#6d7564')
PAPER = colors.HexColor('#f7f2e7')
CARD = colors.HexColor('#fffaf0')
PATH = colors.HexColor('#80936b')
RULE = colors.HexColor('#c6c6ae')
FONT = 'OpeningSans'
BOLD = 'OpeningSansBold'

pdfmetrics.registerFont(TTFont(FONT, '/usr/share/fonts/truetype/open-sans/OpenSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont(BOLD, '/usr/share/fonts/truetype/open-sans/OpenSans-Semibold.ttf'))

out = ROOT / 'OPENING-REVIEW.pdf'
c = canvas.Canvas(str(out), pagesize=(W, H))
c.setTitle('Farbtupf — Opening design in original A, Painted woodland')
c.setAuthor('Farbtupf design planning')


def page(title, number):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFont(BOLD, 21)
    c.setFillColor(INK)
    c.drawString(32, H - 36, title)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(32, 30, W - 32, 30)
    c.setFillColor(MUTED)
    c.setFont(FONT, 8)
    c.drawString(32, 17, 'Original A selected · Static design · Device and child checks pending · App unchanged')
    c.drawRightString(W - 32, 17, str(number))


def paragraph(value, x, y, width, size=11, leading=16):
    c.setFillColor(INK)
    c.setFont(FONT, size)
    for line in simpleSplit(value, FONT, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def board(filename, title, number, note):
    page(title, number)
    reader = ImageReader(str(ROOT / filename))
    iw, ih = reader.getSize()
    scale = min((W - 40) / iw, (H - 112) / ih)
    pw, ph = iw * scale, ih * scale
    c.drawImage(reader, (W - pw) / 2, 67 + (H - 112 - ph) / 2,
                width=pw, height=ph, mask='auto')
    paragraph(note, 33, 49, W - 66, 9, 12)
    c.showPage()


board('opening-layout.png', 'Opening layout and camera', 1,
      'The existing route reaches both neighbours; the timber repair adds their direct shortcut. Map labels are adult planning annotations.')
board('opening-support.png', 'Help, leaving and return', 2,
      'Repeat the instruction or a separate demonstration; return safely, continue later, and keep completed help. These are concept states.')


def connectivity(x, y, after):
    width, height = 365, 166
    c.setFillColor(CARD)
    c.setStrokeColor(RULE)
    c.roundRect(x, y, width, height, 12, stroke=1, fill=1)
    c.setFillColor(INK)
    c.setFont(BOLD, 13)
    c.drawString(x + 16, y + height - 23, 'After helping' if after else 'Before helping')
    b = (x + 61, y + 91)
    g = (x + width - 61, y + 91)
    t = (x + width / 2, y + 33)
    c.setStrokeColor(PATH)
    c.setLineWidth(4)
    for start, end in [(b, t), (t, g)]:
        c.line(*start, *end)
    c.setLineWidth(3)
    if not after:
        c.setDash(5, 5)
        c.setStrokeColor(RULE)
    else:
        c.setStrokeColor(INK)
    c.line(*b, *g)
    c.setDash()
    for centre, label in [(b, 'Beaver'), (g, 'Hare'), (t, 'Heart Tree')]:
        c.setFillColor(CARD)
        c.setStrokeColor(INK)
        c.setLineWidth(1.5)
        c.circle(*centre, 8, stroke=1, fill=1)
        c.setFillColor(INK)
        c.setFont(BOLD, 10)
        c.drawCentredString(centre[0], centre[1] - 22, label)
    c.setFont(FONT, 9)
    c.setFillColor(MUTED)
    c.drawCentredString(x + width / 2, y + 109,
                        'Timber shortcut usable' if after else 'Timber bridge unfinished')


page('What the first playable slice needs to demonstrate', 3)
paragraph('One short shared quest, two existing approaches, and a visible lasting connection.',
          36, H - 68, W - 72, 12, 17)
connectivity(36, 318, False)
connectivity(W - 36 - 365, 318, True)
paragraph('Connectivity diagrams are schematic. The garden approach uses the existing broad stone-and-earth crossing.',
          36, 298, W - 72, 9, 13)

c.setFont(BOLD, 14)
c.setFillColor(INK)
c.drawString(36, 257, 'Picture-led play')
c.drawString(439, 257, 'Durable progress')
left_y, right_y = 234, 234
for value in [
    'Either neighbour leads to the same bridge request.',
    'Spoken guidance and a separate example teach the action; live answers remain unmarked.',
    'The place picture returns to Beaver. Leaving an unfinished task remains a welcome route.',
]:
    left_y = paragraph(value, 36, left_y, 354, 11, 16) - 10
for value in [
    'Round success counts even when its learning star was earned before.',
    'Save the repair once before celebration. Interruptions never undo the completed bridge.',
    'Exact question restoration requires an activity snapshot; safe-place and level recovery remain explicit.',
]:
    right_y = paragraph(value, 439, right_y, 365, 11, 16) - 10

c.setFont(BOLD, 13)
c.setFillColor(INK)
c.drawString(36, 100, 'Next phase')
paragraph('After a build instruction, create the local Three.js opening with one existing flat activity. Then observe movement, real speech, help, return and the bridge payoff on the intended device before expanding the forest.',
          36, 79, W - 72, 10, 15)
c.showPage()
c.save()

doc = fitz.open(out)
for index in [0, 2]:
    doc[index].get_pixmap(matrix=fitz.Matrix(1.5, 1.5)).save(
        ROOT / ('opening-review-cover.png' if index == 0 else 'opening-review-summary.png'))
print({'pdf': str(out), 'pages': len(doc), 'bytes': out.stat().st_size})
doc.close()
