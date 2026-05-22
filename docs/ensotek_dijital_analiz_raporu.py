#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ensotek Dijital Rekabet Analizi Raporu
Otomatik PDF Üreticisi — ReportLab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import BalancedColumns
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics import renderPDF
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import date
import os

# ─── RENKLER ───────────────────────────────────────────────────────────────
ENSOTEK_BLUE   = colors.HexColor('#0A2D5A')   # koyu lacivert — marka
ENSOTEK_CYAN   = colors.HexColor('#00A8E8')   # açık mavi — vurgu
ACCENT_ORANGE  = colors.HexColor('#E87B00')   # turuncu — uyarı
ACCENT_GREEN   = colors.HexColor('#2E8B57')   # yeşil — iyi
ACCENT_RED     = colors.HexColor('#C0392B')   # kırmızı — kritik
LIGHT_BLUE     = colors.HexColor('#EBF5FB')   # tablo satır
LIGHT_GRAY     = colors.HexColor('#F8F9FA')
MID_GRAY       = colors.HexColor('#95A5A6')
DARK_GRAY      = colors.HexColor('#2C3E50')
WHITE          = colors.white
BLACK          = colors.black
TABLE_HEADER   = ENSOTEK_BLUE

# ─── SAYFA BOYUTU & MARJLAR ────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN_L = 2.2 * cm
MARGIN_R = 2.2 * cm
MARGIN_T = 2.0 * cm
MARGIN_B = 2.0 * cm

OUTPUT_PATH = "/home/orhan/Documents/Projeler/Ensotek/Ensotek_Dijital_Analiz_Raporu_2026.pdf"

# ─── STİLLER ───────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def style(name, **kw):
    s = ParagraphStyle(name, **kw)
    return s

S_COVER_TITLE = style('cover_title',
    fontName='Helvetica-Bold', fontSize=32, textColor=WHITE,
    leading=40, alignment=TA_CENTER, spaceAfter=8)

S_COVER_SUBTITLE = style('cover_subtitle',
    fontName='Helvetica', fontSize=14, textColor=colors.HexColor('#B0C4DE'),
    leading=20, alignment=TA_CENTER, spaceAfter=4)

S_COVER_META = style('cover_meta',
    fontName='Helvetica', fontSize=10, textColor=colors.HexColor('#90A0B0'),
    leading=15, alignment=TA_CENTER)

S_CHAPTER = style('chapter',
    fontName='Helvetica-Bold', fontSize=16, textColor=ENSOTEK_BLUE,
    leading=22, spaceBefore=14, spaceAfter=8,
    borderPad=4)

S_SECTION = style('section',
    fontName='Helvetica-Bold', fontSize=12, textColor=ENSOTEK_BLUE,
    leading=16, spaceBefore=10, spaceAfter=5)

S_SUBSECTION = style('subsection',
    fontName='Helvetica-Bold', fontSize=10, textColor=DARK_GRAY,
    leading=14, spaceBefore=7, spaceAfter=3)

S_BODY = style('body',
    fontName='Helvetica', fontSize=9.5, textColor=DARK_GRAY,
    leading=14, spaceBefore=2, spaceAfter=2, alignment=TA_JUSTIFY)

S_BODY_SMALL = style('body_small',
    fontName='Helvetica', fontSize=8.5, textColor=DARK_GRAY,
    leading=12, spaceBefore=1, spaceAfter=1)

S_BULLET = style('bullet',
    fontName='Helvetica', fontSize=9.5, textColor=DARK_GRAY,
    leading=13, spaceBefore=1, spaceAfter=1,
    leftIndent=14, bulletIndent=4)

S_NOTE = style('note',
    fontName='Helvetica-Oblique', fontSize=8.5, textColor=MID_GRAY,
    leading=12, spaceBefore=2, spaceAfter=2)

S_TABLE_HEADER = style('table_header',
    fontName='Helvetica-Bold', fontSize=8.5, textColor=WHITE,
    leading=11, alignment=TA_CENTER)

S_TABLE_CELL = style('table_cell',
    fontName='Helvetica', fontSize=8.5, textColor=DARK_GRAY,
    leading=11, alignment=TA_LEFT)

S_TABLE_CELL_C = style('table_cell_c',
    fontName='Helvetica', fontSize=8.5, textColor=DARK_GRAY,
    leading=11, alignment=TA_CENTER)

S_TAG_CRITICAL = style('tag_crit',
    fontName='Helvetica-Bold', fontSize=8, textColor=WHITE,
    leading=10, alignment=TA_CENTER)

S_CAPTION = style('caption',
    fontName='Helvetica-Oblique', fontSize=8, textColor=MID_GRAY,
    leading=11, alignment=TA_CENTER, spaceBefore=2, spaceAfter=6)

# ─── YARDIMCI FONKSİYONLAR ─────────────────────────────────────────────────

def hr(color=ENSOTEK_CYAN, thickness=1.5, spaceB=6, spaceA=6):
    return HRFlowable(width='100%', thickness=thickness,
                      color=color, spaceAfter=spaceA, spaceBefore=spaceB)

def chapter_header(title, subtitle=None):
    items = []
    items.append(Spacer(1, 4))
    # Mavi çizgi üst
    items.append(HRFlowable(width='100%', thickness=3,
                             color=ENSOTEK_BLUE, spaceAfter=6, spaceBefore=2))
    items.append(Paragraph(title, S_CHAPTER))
    if subtitle:
        items.append(Paragraph(subtitle, S_NOTE))
    items.append(HRFlowable(width='100%', thickness=1,
                             color=ENSOTEK_CYAN, spaceAfter=8, spaceBefore=2))
    return items

def score_bar(score, max_score=10, width=100, height=12):
    """Renkli puan çubuğu drawing döndür."""
    d = Drawing(width + 40, height + 4)
    # arka plan
    d.add(Rect(0, 2, width, height, fillColor=LIGHT_GRAY, strokeColor=None))
    # dolgu rengi
    ratio = score / max_score
    if ratio >= 0.7:
        fill = ACCENT_GREEN
    elif ratio >= 0.5:
        fill = ENSOTEK_CYAN
    elif ratio >= 0.35:
        fill = ACCENT_ORANGE
    else:
        fill = ACCENT_RED
    bar_w = width * ratio
    d.add(Rect(0, 2, bar_w, height, fillColor=fill, strokeColor=None))
    # puan metni
    d.add(String(width + 4, 3, f'{score:.1f}',
                 fontSize=8, fillColor=DARK_GRAY,
                 fontName='Helvetica-Bold'))
    return d

def score_color(score):
    if score >= 7.0:   return ACCENT_GREEN
    if score >= 5.0:   return ENSOTEK_CYAN
    if score >= 3.5:   return ACCENT_ORANGE
    return ACCENT_RED

def score_label(score):
    if score >= 7.0:   return 'İyi'
    if score >= 5.0:   return 'Orta'
    if score >= 3.5:   return 'Zayıf'
    return 'Kritik'

def colored_score(score):
    c = score_color(score)
    return Paragraph(f'<b>{score:.1f}</b>', ParagraphStyle(
        'sc', fontName='Helvetica-Bold', fontSize=9,
        textColor=c, alignment=TA_CENTER, leading=12))

def p(text, style=S_BODY):
    return Paragraph(text, style)

def bullet(text):
    return Paragraph(f'• {text}', S_BULLET)

def sp(h=6):
    return Spacer(1, h)

def build_score_table(rows_data, col_widths=None):
    """Genel puanlama tablosu."""
    available_w = PAGE_W - MARGIN_L - MARGIN_R
    if col_widths is None:
        col_widths = [available_w * 0.38] + [available_w * 0.062] * 8 + [available_w * 0.08]

    header = [
        p('Alan', S_TABLE_HEADER),
        p('niba', S_TABLE_HEADER),
        p('yolya.', S_TABLE_HEADER),
        p('cenk', S_TABLE_HEADER),
        p('ctp', S_TABLE_HEADER),
        p('.de', S_TABLE_HEADER),
        p('kuhlt.', S_TABLE_HEADER),
        p('.com.tr', S_TABLE_HEADER),
        p('.com', S_TABLE_HEADER),
        p('Not', S_TABLE_HEADER),
    ]

    table_data = [header] + rows_data

    style_cmds = [
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0D8E0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROUNDEDCORNERS', [3, 3, 3, 3]),
    ]

    t = Table(table_data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle(style_cmds))
    return t

# ─── VERİ ──────────────────────────────────────────────────────────────────

AREAS = [
    'A. Teknik Altyapı',
    'B. SEO',
    'C. İçerik & Mesajlaşma',
    'D. UX & Tasarım',
    'E. Güven Sinyalleri',
    'F. GEO / AI Görünürlük',
    'G. Dijital Pazarlama',
    'H. Dönüşüm Optimizasyonu',
]

# [niba, yolyapi, cenk, ctp, ensotek.de, kuhlturm, ensotek.com.tr, ensotek.com]
SCORES = {
    'A. Teknik Altyapı':          [4.0, 5.0, 6.0, 6.0, 5.0, 7.0, 6.5, 5.0],
    'B. SEO':                     [3.0, 4.0, 6.5, 5.0, 4.0, 6.0, 4.5, 4.0],
    'C. İçerik & Mesajlaşma':     [5.0, 6.0, 7.0, 7.0, 6.5, 7.0, 7.0, 7.0],
    'D. UX & Tasarım':            [4.0, 5.0, 5.0, 6.0, 6.0, 7.0, 7.5, 5.0],
    'E. Güven Sinyalleri':        [6.0, 5.0, 7.5, 7.0, 5.5, 7.0, 4.0, 7.0],
    'F. GEO / AI Görünürlük':     [1.0, 1.0, 2.0, 3.0, 2.0, 3.0, 3.0, 2.0],
    'G. Dijital Pazarlama':       [4.0, 3.0, 5.0, 6.0, 4.5, 6.0, 5.0, 4.0],
    'H. Dönüşüm Optimizasyonu':   [2.0, 6.0, 4.0, 4.0, 6.0, 7.0, 5.5, 3.5],
}

SITES = ['niba', 'yolyapi', 'cenk', 'ctp', 'ensotek.de', 'kuhlturm.com', 'ensotek.com.tr', 'ensotek.com']
AVERAGES = {
    'niba': 3.6, 'yolyapi': 4.4, 'cenk': 5.4, 'ctp': 5.5,
    'ensotek.de': 4.9, 'kuhlturm.com': 6.3, 'ensotek.com.tr': 5.4, 'ensotek.com': 4.9,
}


# ─── HEADER / FOOTER ──────────────────────────────────────────────────────

class EnsoReport(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        self.page_num = 0
        super().__init__(*args, **kwargs)

    def handle_pageBegin(self):
        self.page_num += 1
        super().handle_pageBegin()

def on_page(canvas, doc):
    """Her sayfaya header & footer ekle."""
    canvas.saveState()
    w, h = A4

    # ─ FOOTER ─
    canvas.setFillColor(ENSOTEK_BLUE)
    canvas.rect(0, 0, w, 1.1 * cm, fill=1, stroke=0)

    canvas.setFont('Helvetica-Bold', 7)
    canvas.setFillColor(WHITE)
    canvas.drawString(MARGIN_L, 0.38 * cm, 'ENSOTEK — Dijital Rekabet & Durum Analizi Raporu')

    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#90A8C0'))
    canvas.drawRightString(w - MARGIN_R, 0.38 * cm, f'Sayfa {doc.page}  |  Gizli')

    # ─ HEADER (ilk sayfa hariç) ─
    if doc.page > 1:
        canvas.setFillColor(ENSOTEK_BLUE)
        canvas.rect(0, h - 0.9 * cm, w, 0.9 * cm, fill=1, stroke=0)
        canvas.setFont('Helvetica-Bold', 7)
        canvas.setFillColor(colors.HexColor('#90A8C0'))
        canvas.drawString(MARGIN_L, h - 0.6 * cm, 'ensotek.de  |  kuhlturm.com  |  ensotek.com.tr  |  ensotek.com')
        canvas.setFillColor(WHITE)
        canvas.drawRightString(w - MARGIN_R, h - 0.6 * cm, f'Nisan 2026')

    canvas.restoreState()

def on_first_page(canvas, doc):
    """Kapak sayfası arka planı."""
    canvas.saveState()
    w, h = A4

    # Arka plan gradyan (dikdörtgen katmanlar ile simüle)
    canvas.setFillColor(ENSOTEK_BLUE)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Üst geometrik şekil
    canvas.setFillColor(colors.HexColor('#0D3570'))
    canvas.rect(0, h * 0.55, w, h * 0.45, fill=1, stroke=0)

    # Dekoratif yatay çizgiler
    canvas.setStrokeColor(colors.HexColor('#1A4A8A'))
    canvas.setLineWidth(0.5)
    for y in [h * 0.35, h * 0.30, h * 0.25]:
        canvas.line(MARGIN_L, y, w - MARGIN_R, y)

    # Cyan vurgu çizgisi
    canvas.setStrokeColor(ENSOTEK_CYAN)
    canvas.setLineWidth(3)
    canvas.line(MARGIN_L, h * 0.48, w * 0.6, h * 0.48)

    # Footer
    canvas.setFillColor(colors.HexColor('#061D3A'))
    canvas.rect(0, 0, w, 1.1 * cm, fill=1, stroke=0)
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#506070'))
    canvas.drawString(MARGIN_L, 0.38 * cm, 'GİZLİ — Yalnızca Ensotek Yönetimi için hazırlanmıştır')
    canvas.drawRightString(w - MARGIN_R, 0.38 * cm, 'Sayfa 1')

    canvas.restoreState()


# ─── PDF İNŞA ─────────────────────────────────────────────────────────────

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=2.5 * cm,
        bottomMargin=1.8 * cm,
        title='Ensotek Dijital Rekabet Analizi Raporu',
        author='Ensotek Stratejik Analiz',
        subject='Dijital Durum & Rakip Karşılaştırması',
    )

    story = []

    # ═══════════════════════════════════════════════════════════════════
    # KAPAK SAYFASI
    # ═══════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 4.5 * cm))
    story.append(p('<font color="#90D0F0">DİJİTAL REKABET ANALİZİ</font>', ParagraphStyle(
        'ct1', fontName='Helvetica', fontSize=11, textColor=colors.HexColor('#90D0F0'),
        alignment=TA_CENTER, leading=16, spaceAfter=6)))
    story.append(p('<b>Ensotek Kühltürme &amp; Teknolojileri</b>', ParagraphStyle(
        'ct2', fontName='Helvetica-Bold', fontSize=28, textColor=WHITE,
        alignment=TA_CENTER, leading=36, spaceAfter=4)))
    story.append(p('Dijital Durum Analizi ve Rakip Karşılaştırması', ParagraphStyle(
        'ct3', fontName='Helvetica', fontSize=14, textColor=colors.HexColor('#B0C8E0'),
        alignment=TA_CENTER, leading=20, spaceAfter=2)))
    story.append(Spacer(1, 0.8 * cm))
    story.append(p('─' * 48, ParagraphStyle(
        'ct4', fontName='Helvetica', fontSize=10, textColor=ENSOTEK_CYAN,
        alignment=TA_CENTER, leading=14, spaceAfter=10)))

    # Meta bilgiler tablosu — kapakta
    meta_data = [
        ['Rapor Tarihi:', 'Nisan 2026'],
        ['Hazırlayan:', 'Dijital Strateji & Analiz'],
        ['Kapsam:', '4 Rakip + 4 Ensotek Domaini'],
        ['Analiz Yöntemi:', 'Teknik Tarama, İçerik Denetimi, SEO & GEO Analizi'],
        ['Sınıflama:', 'GİZLİ — Yalnızca Firma Yönetimi'],
    ]
    meta_table = Table(meta_data, colWidths=[5*cm, 10*cm])
    meta_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#90D0F0')),
        ('TEXTCOLOR', (1,0), (1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 1. YÖNETİCİ ÖZETİ
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('1. Yönetici Özeti', 'Executive Summary')

    story.append(p(
        'Bu rapor, Ensotek\'in dört aktif web domaininin (ensotek.de, kuhlturm.com, '
        'ensotek.com.tr, ensotek.com) ve sektörün dört doğrudan rakibinin '
        '(niba.com.tr, yolyapi.com.tr, cenk.com.tr, ctpmuhendislik.com) kapsamlı '
        'dijital analizini sunmaktadır. Analiz; teknik altyapı, SEO, içerik kalitesi, '
        'kullanıcı deneyimi, güven sinyalleri, yapay zeka (GEO) görünürlüğü, dijital '
        'pazarlama ve dönüşüm optimizasyonu olmak üzere sekiz kritik alanda gerçekleştirilmiştir.'
    ))
    story.append(sp(6))

    # Özet kutu — 4 ana bulgu
    key_findings = [
        ('KRİTİK FIRSAT', ACCENT_GREEN,
         'GEO/AI Görünürlük alanında TÜM rakipler ve Ensotek domainleri 0-3/10 bandında. '
         'llms.txt ve JSON-LD schema ekleyecek ilk marka sektörde rekabetsiz üstünlük kazanır.'),
        ('KRİTİK RİSK', ACCENT_RED,
         'ensotek.com (eski site, 411 URL, 20 yıllık domain) ensotek.de\'ye 301 redirect '
         'yapmıyor. Bu iki sitenin backlink authority\'si bölünmüş, SEO gücü ikiye ayrılmış durumdadır.'),
        ('YASAL RİSK', ACCENT_ORANGE,
         'ensotek.de iletişim ve Impressum sayfasında fiziksel adres, telefon ve USt-IdNr '
         'bulunmuyor. Alman hukukunda (TMG §5) bu bilgilerin yayınlanması zorunludur.'),
        ('TEKNİK SORUN', ENSOTEK_CYAN,
         'ensotek.de\'de ürün, blog, ekip ve proje sayfaları JavaScript (CSR) ile render '
         'ediliyor. Googlebot bu sayfaların içeriğini görmüyor. Tüm SEO yatırımı boşa gidiyor.'),
    ]

    for label, color, text in key_findings:
        box_data = [[
            Paragraph(f'<b>{label}</b>', ParagraphStyle(
                'kf_label', fontName='Helvetica-Bold', fontSize=8,
                textColor=WHITE, leading=11, alignment=TA_CENTER)),
            Paragraph(text, ParagraphStyle(
                'kf_text', fontName='Helvetica', fontSize=8.5,
                textColor=DARK_GRAY, leading=12))
        ]]
        box = Table(box_data, colWidths=[2.4*cm, PAGE_W - MARGIN_L - MARGIN_R - 2.4*cm - 0.4*cm])
        box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), color),
            ('BACKGROUND', (1,0), (1,0), LIGHT_GRAY),
            ('ALIGN', (0,0), (0,0), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 7),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#D0D8E0')),
            ('LINEAFTER', (0,0), (0,-1), 2, color),
        ]))
        story.append(box)
        story.append(sp(4))

    story.append(sp(8))

    # Genel skor özet tablosu
    story.append(p('Genel Skor Özeti', S_SECTION))

    summary_data = [
        [p('Domain', S_TABLE_HEADER),
         p('Kategori', S_TABLE_HEADER),
         p('Ort. Puan', S_TABLE_HEADER),
         p('Durum', S_TABLE_HEADER),
         p('En Güçlü Alan', S_TABLE_HEADER),
         p('En Zayıf Alan', S_TABLE_HEADER)],
        # Rakipler
        [p('niba.com.tr', S_TABLE_CELL), p('Rakip', S_TABLE_CELL_C),
         colored_score(3.6), p('Kritik', S_TABLE_CELL_C),
         p('Güven (CTI sert.)', S_TABLE_CELL), p('GEO/AI + Dönüşüm', S_TABLE_CELL)],
        [p('yolyapi.com.tr', S_TABLE_CELL), p('Rakip', S_TABLE_CELL_C),
         colored_score(4.4), p('Zayıf', S_TABLE_CELL_C),
         p('Dönüşüm Formu', S_TABLE_CELL), p('GEO/AI + Pazarlama', S_TABLE_CELL)],
        [p('cenk.com.tr', S_TABLE_CELL), p('Rakip', S_TABLE_CELL_C),
         colored_score(5.4), p('Orta', S_TABLE_CELL_C),
         p('Referanslar (KARDEMIR vb.)', S_TABLE_CELL), p('GEO/AI Görünürlük', S_TABLE_CELL)],
        [p('ctpmuhendislik.com', S_TABLE_CELL), p('Rakip', S_TABLE_CELL_C),
         colored_score(5.5), p('Orta', S_TABLE_CELL_C),
         p('Blog Derinliği + 5 Platform', S_TABLE_CELL), p('H1 Yok + JSON-LD Yok', S_TABLE_CELL)],
        # Ensotek
        [p('<b>ensotek.de</b>', S_TABLE_CELL), p('<b>Ensotek</b>', S_TABLE_CELL_C),
         colored_score(4.9), p('Zayıf', S_TABLE_CELL_C),
         p('Servis Derinliği + CSR Hesap.', S_TABLE_CELL), p('CSR + Impressum + JSON-LD', S_TABLE_CELL)],
        [p('<b>kuhlturm.com</b>', S_TABLE_CELL), p('<b>Ensotek</b>', S_TABLE_CELL_C),
         colored_score(6.3), p('İyi', S_TABLE_CELL_C),
         p('CTA + Referanslar + WhatsApp', S_TABLE_CELL), p('GEO/AI + Tek Dil + Blog', S_TABLE_CELL)],
        [p('<b>ensotek.com.tr</b>', S_TABLE_CELL), p('<b>Ensotek</b>', S_TABLE_CELL_C),
         colored_score(5.4), p('Orta', S_TABLE_CELL_C),
         p('UX + İçerik Derinliği', S_TABLE_CELL), p('Ref. Boş + Schema Yok + Blog', S_TABLE_CELL)],
        [p('<b>ensotek.com</b>', S_TABLE_CELL), p('<b>Eski Site</b>', S_TABLE_CELL_C),
         colored_score(4.9), p('Risk', S_TABLE_CELL_C),
         p('411 URL + 20 Yıl Domain', S_TABLE_CELL), p('Redirect Yok + Dup. Content', S_TABLE_CELL)],
    ]

    avail_w = PAGE_W - MARGIN_L - MARGIN_R
    sum_table = Table(summary_data,
                      colWidths=[avail_w*0.18, avail_w*0.1, avail_w*0.1,
                                  avail_w*0.09, avail_w*0.27, avail_w*0.26],
                      repeatRows=1)
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
        # Ensotek satırları hafif vurgu
        ('BACKGROUND', (0,5), (-1,8), colors.HexColor('#EDF4FB')),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0D8E0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        # Rakip/Ensotek ayırt edici sol çizgi
        ('LINEAFTER', (1,5), (1,8), 1.5, ENSOTEK_CYAN),
    ]))
    story.append(sum_table)
    story.append(sp(4))
    story.append(p('* Puanlar 0–10 arası. Renkler: Yeşil ≥7 İyi | Mavi ≥5 Orta | Turuncu ≥3.5 Zayıf | Kırmızı <3.5 Kritik', S_NOTE))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 2. ANALİZ METODOLOJİSİ
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('2. Analiz Metodolojisi')

    story.append(p(
        'Her site 8 temel alan üzerinden incelenmiştir. Analiz, canlı site tarama, '
        'HTML kaynak kodu denetimi, robots.txt ve sitemap.xml incelemesi, '
        'yapılandırılmış veri (JSON-LD/Microdata) kontrolü ve içerik derinliği '
        'değerlendirmesini kapsamaktadır. Puanlar 0–10 ölçeğinde verilmiştir.'
    ))
    story.append(sp(8))

    method_data = [
        [p('Alan', S_TABLE_HEADER), p('Kapsam', S_TABLE_HEADER), p('Ağırlık', S_TABLE_HEADER)],
        [p('A. Teknik Altyapı', S_TABLE_CELL),
         p('Sunucu, SSL, HTTP/2, lazy loading, sitemap, robots.txt, CMS/Framework', S_TABLE_CELL),
         p('Yüksek', S_TABLE_CELL_C)],
        [p('B. SEO', S_TABLE_CELL),
         p('Title, meta description, H1-H6, canonical, hreflang, schema, URL yapısı', S_TABLE_CELL),
         p('Çok Yüksek', S_TABLE_CELL_C)],
        [p('C. İçerik & Mesajlaşma', S_TABLE_CELL),
         p('Değer önerisi, ürün kataloğu, blog, referanslar, sertifikalar, dil', S_TABLE_CELL),
         p('Yüksek', S_TABLE_CELL_C)],
        [p('D. UX & Tasarım', S_TABLE_CELL),
         p('Hero bölümü, navigasyon, CTA, formlar, görsel kalite, marka tutarlılığı', S_TABLE_CELL),
         p('Orta', S_TABLE_CELL_C)],
        [p('E. Güven Sinyalleri', S_TABLE_CELL),
         p('Müşteri logoları, kuruluş yılı, ekip profili, testimonial, NAP şeffaflığı', S_TABLE_CELL),
         p('Yüksek', S_TABLE_CELL_C)],
        [p('F. GEO / AI Görünürlük', S_TABLE_CELL),
         p('llms.txt, robots.txt AI direktifleri, JSON-LD schema, AI citability', S_TABLE_CELL),
         p('Çok Yüksek', S_TABLE_CELL_C)],
        [p('G. Dijital Pazarlama', S_TABLE_CELL),
         p('Sosyal medya, GBP, analytics/GTM, fuar & etkinlik içerikleri', S_TABLE_CELL),
         p('Orta', S_TABLE_CELL_C)],
        [p('H. Dönüşüm Optimizasyonu', S_TABLE_CELL),
         p('Teklif formu, WhatsApp, katalog indirme, lead capture, canlı chat', S_TABLE_CELL),
         p('Yüksek', S_TABLE_CELL_C)],
    ]
    avail_w = PAGE_W - MARGIN_L - MARGIN_R
    m_table = Table(method_data, colWidths=[avail_w*0.23, avail_w*0.63, avail_w*0.14], repeatRows=1)
    m_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0D8E0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
    ]))
    story.append(m_table)
    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 3. RAKİP ANALİZİ
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('3. Rakip Analizi',
                             'niba.com.tr | yolyapi.com.tr | cenk.com.tr | ctpmuhendislik.com')

    competitors = [
        {
            'name': 'niba.com.tr',
            'avg': 3.6,
            'stack': 'PHP 7.4 (EOL) + Cloudflare + Apache',
            'scores': [4.0, 3.0, 5.0, 4.0, 6.0, 1.0, 4.0, 2.0],
            'strong': [
                'CTI Sertifikası — uluslararası cooling tower standardı, sektörde güçlü farklılaştırıcı',
                '30 yıllık deneyim ve 72 ülkede referans — sayısal kanıtla desteklenmiş otorite',
                '163 referans görseli — geniş proje hacmi somut olarak belgelenmiş',
                'Kule Seçim Programı (nibatower.com) — teknik satış desteği için interaktif araç',
                'Cloudflare CDN + HTTPS + CookieBot GDPR — temel güvenlik altyapısı mevcut',
            ],
            'weak': [
                'sitemap.xml yok — Google sistematik tarayamıyor, endeksleme körleşmiş',
                'Ana sayfada H1 etiketi yok — Google sayfanın konusunu anlayamıyor',
                'Schema / Structured data tamamen sıfır — AI arama motorlarından dışlanmış',
                'llms.txt yok, robots.txt geçersiz (AB direktifi beyannamesi) — AI görünürlük sıfır',
                'jQuery iki kez yükleniyor — her ziyarette 90KB+ gereksiz yük',
                'PHP 7.4 End of Life — güvenlik yaması almayan sürüm, ciddi risk',
                'LinkedIn linki admin paneline yönlendiriyor — tüm ziyaretçiler yanlış sayfaya gidiyor',
                'Ana sayfada teklif / iletişim formu yok — dönüşüm noktası yok',
                'WhatsApp entegrasyonu yok — en yaygın B2B iletişim kanalı atlanmış',
                'Blog içeriği 2018\'de durmuş — içerik pazarlama tamamen terk edilmiş',
            ],
        },
        {
            'name': 'yolyapi.com.tr',
            'avg': 4.4,
            'stack': 'ASP.NET + Cloudflare + PleskWin (Windows Hosting)',
            'scores': [5.0, 4.0, 6.0, 5.0, 5.0, 1.0, 3.0, 6.0],
            'strong': [
                '1982 kuruluş (44 yıl) — sektörde en köklü tecrübe vurgusu',
                'Detaylı B2B teklif formu (/teklif-iste) — Firma, sektör, şehir dahil 8 alan',
                'Sağ kenarda sabit "Teklif Al" butonu — her sayfada görünür CTA',
                'E-katalog PDF mevcut (/dosya/yolyapi-katalog.pdf)',
                'Soğutma kulesi hesap makinesi (/hesap-makinesi) — değerli teknik lead magnet',
                'ISO 9001 sertifikası, Türkçe + İngilizce subdomain desteği',
            ],
            'weak': [
                'Tüm büyük AI botlar Cloudflare varsayılanıyla engellenmiş (GPTBot, ClaudeBot, Google-Extended) — AI arama görünürlüğü sıfır',
                'H1 etiketi ana sayfada yok — kritik SEO açığı',
                'sitemap.xml yok — tüm sayfaların bulunması garanti değil',
                'Schema.org hataları kritik: streetAddress boş, priceRange:"2030" yıl yazılmış, brand:"CinFikir" ajans adı',
                'Footer copyright 2022-2023 — 2026\'da güncellenmemiş, terk edilmiş görüntü veriyor',
                'WhatsApp, Instagram, Facebook HTML\'de yorum satırında — devre dışı',
                'Meta description değer önerisi yok — title\'ın kopyası',
                'Referanslar bölümünde kodlama hatası: 6 proje görseli hepsi "As Çimento" yazıyor',
                'Müşteri yorumu şablondan kopyalanmış, yazım hatası var ("alakalrından")',
            ],
        },
        {
            'name': 'cenk.com.tr',
            'avg': 5.4,
            'stack': 'WordPress + LiteSpeed + Cloudflare + Rank Math SEO',
            'scores': [6.0, 6.5, 7.0, 5.0, 7.5, 2.0, 5.0, 4.0],
            'strong': [
                'KARDEMIR, İSDEMİR, KAPTAN GRUBU, ASSAN ALÜMİNYUM — 20+ dev sektör referansı',
                '48 blog yazısı, SEO hedefli başlıklar ("Su Soğutma Kulesi Maliyeti Ne Kadardır?")',
                'LiteSpeed Cache + Cloudflare — görece optimize teknik altyapı',
                'Rehabilitasyon, Modernizasyon, Rekonstruksiyon — tam yaşam döngüsü hizmetleri',
                'Türkçe + İngilizce + Rusça (3 dil) — ihracat erişimi için altyapı mevcut',
                'Uluslararası referanslar: Libya, Ekvator, Leon/Odin/Lisa sertifikaları',
                '"Basında Biz" sayfası — medya görünürlüğü kanıtlanmış',
                'İki fiziksel adres (İstanbul + Düzce), yönetici adı (Ekrem) görünür',
            ],
            'weak': [
                'llms.txt yok — AI motorlarına içerik haritası sunulmuyor',
                'Ana sayfada H2 hiç yok — tek H1 site adının tekrarı',
                'Anasayfada Organization şeması Person tipinde — Google ve AI için kritik hata',
                'PDF katalog yok — sadece YouTube\'a link, teknik doküman indirme yok',
                'WhatsApp butonu / tıklanabilir link yok',
                '"Ekibimiz" sayfasında ekip üyesi yok — başlık "PROJELERİMİZ" yazıyor',
                'Belirgin teklif CTA butonu yok — metin linklere gömülü',
                'PHP 7.4 kullanımı — EOL sürüm',
            ],
        },
        {
            'name': 'ctpmuhendislik.com',
            'avg': 5.5,
            'stack': 'Nginx + Custom Framework + PWA + Bootstrap',
            'scores': [6.0, 5.0, 7.0, 6.0, 7.0, 3.0, 6.0, 4.0],
            'strong': [
                'En teknik blog içeriği: "Nükleer Santrallerde Soğutma", "İllere Göre Yaş Termometre" — sektörde nadir',
                'Arçelik, Eti, Türkşeker, UNICEF, Bulgaristan, Azerbaycan, Cezayir referansları',
                '100+ model, 2000+ referans, 3000\'e yakın çalışan makina — somut istatistikler',
                '10 hizmet kategorisi — üretim + yedek parça + danışmanlık + SCADA',
                'PWA + Service Worker — modern altyapı, offline erişim desteği',
                'Facebook, Instagram, YouTube, Twitter, LinkedIn, Pinterest — 6 sosyal platform',
                'E-katalog sayfasında 2 adet indirilebilir PDF mevcut',
                '236 görselin tamamında alt text var',
            ],
            'weak': [
                'Ana sayfada H1 etiketi yok — en kritik SEO hatası',
                'JSON-LD schema hiçbir sayfada yok',
                'Meta description\'da yazım hatası: "ekipman teradiği" (tedariki olmalı) — SERP\'te görünür',
                'llms.txt yok — AI arama motorlarında görünürlük şansa bırakılmış',
                '1.3 MB HTML ana sayfa — Core Web Vitals\'ı olumsuz etkiliyor',
                'Ürün sayfasında teknik spesifikasyon tablosu yok',
                'Blog yazılarında author/tarih schema yok — E-E-A-T sinyali zayıf',
                'Google Business Profile linki yok',
            ],
        },
    ]

    for comp in competitors:
        story.append(KeepTogether([
            p(f'3.{competitors.index(comp)+1}. {comp["name"]}', S_SECTION),
        ]))

        # Puan çubuğu ve meta tablo
        meta_row = [
            [p('<b>Genel Ortalama</b>', S_TABLE_CELL),
             p(f'<b>{comp["avg"]:.1f} / 10</b>', ParagraphStyle(
                 'avg', fontName='Helvetica-Bold', fontSize=11,
                 textColor=score_color(comp["avg"]), leading=14)),
             p('<b>Stack:</b>', S_TABLE_CELL),
             p(comp["stack"], S_TABLE_CELL)],
        ]
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        mt = Table(meta_row, colWidths=[avail_w*0.18, avail_w*0.14, avail_w*0.1, avail_w*0.58])
        mt.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_GRAY),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#C0CCDA')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('FONTSIZE', (0,0), (-1,-1), 9),
        ]))
        story.append(mt)
        story.append(sp(6))

        # Alan puanları
        area_data = [[p('Alan', S_TABLE_HEADER), p('Puan', S_TABLE_HEADER), p('Değerlendirme', S_TABLE_HEADER)]]
        for i, (area, score) in enumerate(zip(AREAS, comp['scores'])):
            area_data.append([
                p(area, S_TABLE_CELL),
                colored_score(score),
                p(score_label(score), ParagraphStyle(
                    'sl', fontName='Helvetica', fontSize=8.5,
                    textColor=score_color(score), leading=12, alignment=TA_CENTER)),
            ])
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        at = Table(area_data, colWidths=[avail_w*0.55, avail_w*0.18, avail_w*0.27], repeatRows=1)
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0D8E0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ]))
        story.append(at)
        story.append(sp(8))

        # Güçlü & Zayıf yan tablosu
        strong_weak_data = [
            [p('✓ Güçlü Yanlar', ParagraphStyle(
                'gw_h', fontName='Helvetica-Bold', fontSize=9,
                textColor=ACCENT_GREEN, leading=12)),
             p('✗ Zayıf Yanlar / Riskler', ParagraphStyle(
                 'zw_h', fontName='Helvetica-Bold', fontSize=9,
                 textColor=ACCENT_RED, leading=12))],
        ]
        # Satır sayısını eşitle
        max_rows = max(len(comp['strong']), len(comp['weak']))
        for i in range(max_rows):
            s = comp['strong'][i] if i < len(comp['strong']) else ''
            w_ = comp['weak'][i] if i < len(comp['weak']) else ''
            strong_weak_data.append([
                p(f'• {s}' if s else '', S_BODY_SMALL),
                p(f'• {w_}' if w_ else '', S_BODY_SMALL),
            ])
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        sw = Table(strong_weak_data, colWidths=[avail_w*0.5 - 3, avail_w*0.5 - 3])
        sw.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor('#F0FAF4')),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor('#FDF2F2')),
            ('ROWBACKGROUNDS', (0,1), (0,-1), [WHITE, colors.HexColor('#F8FDF9')]),
            ('ROWBACKGROUNDS', (1,1), (1,-1), [WHITE, colors.HexColor('#FEF9F9')]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#E0E8F0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('LINEAFTER', (0,0), (0,-1), 1, colors.HexColor('#C8D8E0')),
        ]))
        story.append(sw)
        story.append(sp(16))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 4. ENSOTEK KENDİ DURUM ANALİZİ
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('4. Ensotek Dijital Varlık Analizi',
                             'ensotek.de | kuhlturm.com | ensotek.com.tr | ensotek.com')

    ensotek_sites = [
        {
            'name': 'ensotek.de',
            'label': 'Ana Almanya Sitesi',
            'avg': 4.9,
            'stack': 'Next.js + Nginx + Cloudinary (VPS Hostinger)',
            'scores': [5.0, 4.0, 6.5, 6.0, 5.5, 2.0, 4.5, 6.0],
            'strong': [
                '"Soforthilfe" (Acil Yardım) CTA — endüstriyel müşteri için makinenin durması kritik; doğru strateji',
                'Feuchtkugeltemperatur-Rechner (Yaş Termometre Hesaplayıcı) — mühendisleri iş akışında yakalayan lead magnet',
                '10 hizmet kategorisi: bakım, SCADA, retrofit, acil servis — sektörün tamamı kapsanmış',
                'ISO 9001, 14001, 45001, CE, EAC sertifikaları — tender süreçleri için kritik belgeleme',
                'Sitemap: 180 URL, 3 dil (TR/EN/DE), güncel tarihler — sağlıklı sitemap altyapısı',
                'Next.js + Image Optimization — modern, hızlı altyapı zemini',
                'Newsletter abonelik formu ve "Wartung planen" CTA — dönüşüm çeşitliliği',
                'Fuar katılımı (AluExpo, Aquatherm Baku, Hotel-Tech Antalya) — uluslararası otorite',
            ],
            'weak': [
                'CSR Felaketi: Ürünler, blog, ekip, projeler, SSS sayfaları JavaScript ile render — Googlebot içeriği görmüyor',
                'JSON-LD schema tamamen yok: Organization, Product, LocalBusiness, FAQPage, BreadcrumbList — AI kör noktası',
                'Hiçbir sayfada meta description tespit edilemedi — Google rastgele snippet üretiyor, CTR düşük',
                'llms.txt yok — ChatGPT, Claude, Perplexity AI sitemizi yapılandırılmış şekilde tanımıyor',
                'Almanya\'da Impressum zorunlu (TMG §5): adres, isim, USt-IdNr. İletişim sayfasında bunlar yok — YASAL RİSK',
                'Navigasyon dil tutarsızlığı: "About Us" ve "Contact" İngilizce, diğerleri Almanca',
                'Title tag\'larda umlaut hatası: "Kuehltuerme" yerine "Kühltürme" olmalı — Almanca SEO kaybı',
                'İletişim sayfasında adres/telefon/e-posta yok — güven ve yasal açıdan ciddi sorun',
                'Referans/Portfolio sayfaları CSR\'da gizleniyor — en kritik güven kanıtı görüntülenemiyor',
                'URL slug\'larının bir kısmı İngilizce (/about, /contact) — Almanca SEO verimliliği düşük',
            ],
            'actions': [
                ('KRİTİK', ACCENT_RED, 'Tüm CSR sayfalarını Next.js SSR/SSG\'ye geçir (ürünler, blog, ekip, projeler, SSS)'),
                ('KRİTİK', ACCENT_RED, 'Impressum + iletişim sayfasına adres, telefon, USt-IdNr ekle (Alman hukuku)'),
                ('SEO', ACCENT_ORANGE, 'Tüm sayfalara meta description ekle (her sayfa için özgün, 150-160 karakter)'),
                ('SEO', ACCENT_ORANGE, 'Title tag\'lardaki "Kuehltuerme" → "Kühltürme" düzelt'),
                ('SEO', ACCENT_ORANGE, 'Navigasyon ve URL slug\'larını tamamen Almancalaştır'),
                ('GEO', ENSOTEK_CYAN, 'JSON-LD Organization + LocalBusiness schema ekle'),
                ('GEO', ENSOTEK_CYAN, 'JSON-LD Product schema tüm ürün sayfalarına ekle'),
                ('GEO', ENSOTEK_CYAN, 'llms.txt dosyası oluştur'),
                ('PAZARLAMA', MID_GRAY, 'LinkedIn profilini doğrula ve siteden çalışan URL ile linkle'),
                ('PAZARLAMA', MID_GRAY, 'Google Business Profile Almanya kaydı oluştur/doğrula'),
            ],
        },
        {
            'name': 'kuhlturm.com',
            'label': 'Almanca Kühlturm Sitesi (En Yüksek Puanlı)',
            'avg': 6.3,
            'stack': 'Next.js + Cloudinary + Fastify (VPS)',
            'scores': [7.0, 6.0, 7.0, 7.0, 7.0, 3.0, 6.0, 7.0],
            'strong': [
                'En yüksek genel puan (6.3/10) — sektörün en iyi performanslı sitesi',
                'Tüpraş, Ford Otosan, ASELSAN, Erdemir, Arçelik — 28 kurumsal referans',
                '10 hizmet kategorisi (SCADA, Fernüberwachung dahil) — kapsamlı portföy',
                '24 saat yanıt garantili teklif formu + kategoriye göre dropdown seçimi',
                'İki WhatsApp numarası iletişim sayfasında mevcut',
                '4 isimli ekip üyesi (CEO + Operasyon + Biz Dev + Dış Ticaret) şeffaf profil',
                'PDF katalog kütüphanede mevcut (Unternehmensbroschüre)',
                'LinkedIn, Instagram, YouTube, X (Twitter) — 4 aktif sosyal platform',
                '"Soforthilfe" ve "Wartung planen" özel hizmet CTA\'ları — B2B dönüşüm odaklı',
                'İki adres (İstanbul + Ankara Fabrika) — üretim kapasitesi somutlaştırılmış',
            ],
            'weak': [
                'GEO/AI Görünürlük sıfır noktasında: llms.txt yok, JSON-LD schema yok',
                'Meta description tespit edilemedi — SERP tıklama oranı düşük',
                'Sadece Almanca: İngilizce versiyon yok — Almanya\'daki İngilizce arayan karar vericiler kaçırılıyor',
                'Blog: yalnızca 3 makale, hepsi aynı günde — içerik otoritesi ve organik trafik birikimi yok',
                'Müşteri yorumları jenerik Türkçe isimler — Alman B2B alıcısında güven yaratmıyor',
                'Sertifika detayları yok — "kalite sertifikaları var" deniyor ama ISO numara/logo yok',
                'Katalog indirmede lead capture yok — e-posta toplanmadan PDF veriliyor',
                'İki marka karışıklığı: site adı "Kühlturm", logo "Ensotek" — ziyaretçi hangi markayı takip ediyor?',
                'Google Business Profile doğrulaması yok',
            ],
            'actions': [
                ('GEO', ENSOTEK_CYAN, 'JSON-LD Organization + Product + LocalBusiness schema ekle'),
                ('GEO', ENSOTEK_CYAN, 'llms.txt dosyası oluştur'),
                ('İÇERİK', ACCENT_ORANGE, 'Blog frekansını artır: haftada en az 1 Almanca teknik makale'),
                ('SEO', ACCENT_ORANGE, 'Meta description tüm sayfalara ekle'),
                ('DÖNÜŞÜM', ACCENT_ORANGE, 'Katalog indirmeye lead capture formu ekle (e-posta karşılığı PDF)'),
                ('İÇERİK', MID_GRAY, 'İngilizce /en/ versiyon ekle — Almanya\'daki uluslararası alıcılar için'),
                ('GÜVEN', MID_GRAY, 'Gerçek Almanca referans yorumları topla (Google Reviews entegrasyonu)'),
                ('GÜVEN', MID_GRAY, 'ISO/CE sertifika numaralarını ve logolarını ayrı sayfada göster'),
            ],
        },
        {
            'name': 'ensotek.com.tr',
            'label': 'Türkiye Pazarı Sitesi',
            'avg': 5.4,
            'stack': 'Next.js + Nginx (VPS)',
            'scores': [6.5, 4.5, 7.0, 7.5, 4.0, 3.0, 5.0, 5.5],
            'strong': [
                '39+ yıl, 3000+ kurulum, 40+ ülke, 500+ MW — somut ve güvenilir B2B istatistikler',
                'Next.js + WebP görsel optimizasyonu — modern teknik altyapı',
                '"Teklif Al" sticky CTA header\'da + sayfa sonunda tekrar — dönüşüm noktaları düşünülmüş',
                'SSS bölümünde Legionella, kapasite hesaplama, FRP avantajları — teknik içerik derinliği',
                'ISO 9001:2015 sertifikası öne çıkarılmış',
                'Ankara fabrikası ve İstanbul merkezi — iki adres şeffaf, iki e-posta mevcut',
                'Export@ensotek.com.tr ayrı ihracat e-postası — uluslararası pazarlama farkındalığı',
            ],
            'weak': [
                'Referanslar sayfası TAMAMEN BOŞ — "3000+ kurulum" iddiasıyla doğrudan çelişiyor, dönüşüm engeli',
                'JSON-LD schema tamamen yok (Organization, LocalBusiness, Product, FAQPage)',
                'İç sayfalarda meta description yok (ürünler, referanslar, iletişim)',
                'Title tag\'larda çift Ensotek: "Soğutma Kulesi — Ensotek | Ensotek" — amatör template hatası',
                'llms.txt yok — AI görünürlük fırsatı değerlendirilmiyor',
                'Hreflang tag\'ları eksik — TR/EN sayfaları arasında dil sinyali yok',
                'URL slug\'ları İngilizce: /tr/products, /tr/references — Türkçe domain\'de çelişkili',
                'Sosyal medya linkleri yok (footer\'da LinkedIn, YouTube, Instagram yok)',
                'WhatsApp butonu yok — Türkiye B2B\'sinde kritik iletişim kanalı',
                'Blog / içerik pazarlama tamamen yok — organik trafik potansiyeli değerlendirilmiyor',
                'PDF teknik katalog / datasheet indirme yok',
                'Tek testimonial: "Ahmet Yılmaz, Enerji A.Ş." — doğrulanamaz, güven kaybı yaratıyor',
                'GIF animasyon kullanımı — 2026\'da modern video/Lottie yerine GIF performans sorununa yol açıyor',
            ],
            'actions': [
                ('KRİTİK', ACCENT_RED, 'Referanslar sayfasını doldur: en az 15 firma logosu + proje adı + sektör bilgisi'),
                ('KRİTİK', ACCENT_RED, 'Title tag template\'ini düzelt: "Ensotek | Ensotek" → tek "Ensotek"'),
                ('SEO', ACCENT_ORANGE, 'Tüm iç sayfalara meta description ekle'),
                ('SEO', ACCENT_ORANGE, 'Hreflang tag\'larını HTML <head>\'e ekle (TR/EN çapraz referans)'),
                ('SEO', ACCENT_ORANGE, 'URL slug\'larını Türkçe yap: /tr/urunler, /tr/referanslar'),
                ('GEO', ENSOTEK_CYAN, 'JSON-LD Organization + LocalBusiness + FAQPage schema ekle'),
                ('GEO', ENSOTEK_CYAN, 'llms.txt dosyası oluştur'),
                ('DÖNÜŞÜM', ACCENT_ORANGE, 'WhatsApp sticky butonu ekle'),
                ('PAZARLAMA', MID_GRAY, 'Sosyal medya linkleri footer\'a ekle (LinkedIn öncelikli)'),
                ('İÇERİK', MID_GRAY, 'Blog kur: aylık en az 2 teknik Türkçe makale'),
                ('İÇERİK', MID_GRAY, 'PDF ürün katalog ve teknik datasheet indirme sayfası oluştur'),
                ('GÜVEN', MID_GRAY, 'Gerçek müşteri testimonial\'ları: logo + isim + pozisyon + fotoğraflı'),
            ],
        },
        {
            'name': 'ensotek.com',
            'label': 'Eski / Arşiv Site (Aktif — KRİTİK RİSK)',
            'avg': 4.9,
            'stack': 'PHP Custom CMS (2006\'dan beri aktif)',
            'scores': [5.0, 4.0, 7.0, 5.0, 7.0, 2.0, 4.0, 3.5],
            'strong': [
                '20 yıllık domain yaşı (2006) — backlink ve domain authority birikimi',
                '411 URL sitemap, Türkçe + İngilizce + Rusça (3 dil) — kapsamlı içerik',
                'Bilgi bankası: "soğutma kulesi nedir", hesaplama araçları — long-tail SEO trafiği',
                'Güncel haber içeriği (AluExpo 2025, Hotel-Tech Antalya 2024)',
                'Tam NAP bilgisi: İstanbul merkez + Ankara fabrika adresi mevcut',
                'Sosyal medya linkleri footer\'da (Facebook, Instagram, YouTube, Twitter)',
            ],
            'weak': [
                'ensotek.de\'ye 301 redirect YOK — 20 yıllık link authority ikiye bölünmüş',
                'Canonical tag hiçbir sayfada yok — ensotek.de ile duplicate content riski',
                'JSON-LD schema tamamen yok',
                'Meta description ana sayfada yok',
                'PHP custom CMS — modern framework yok, güvenlik açığı riski',
                'E-posta adresi ensotek@ensotek.com.tr — ne .com ne .de, marka tutarsızlığı',
                'ensotek.com terk edilirse 20 yıllık domain geçmişi rakibin eline geçebilir',
            ],
            'actions': [
                ('STRATEJİK', ACCENT_RED, 'Karar: ensotek.com TR pazarı için mi tutulacak yoksa ensotek.de\'ye 301 mi kurulacak?'),
                ('KRİTİK', ACCENT_RED, 'Seçim ne olursa: Cross-domain canonical tag ekle (ensotek.com → ensotek.de)'),
                ('KRİTİK', ACCENT_ORANGE, 'Duplicate content önle: TR pazarı tutulacaksa hreflang+canonical koordinasyonu kur'),
                ('GEO', ENSOTEK_CYAN, 'llms.txt ekle'),
                ('SEO', ACCENT_ORANGE, 'JSON-LD Organization schema ekle'),
                ('SEO', ACCENT_ORANGE, 'Canonical tag tüm sayfalara ekle'),
                ('RİSK', MID_GRAY, 'Domain yenileme takvimine al — asla bırakma, 20 yıllık değer korunmalı'),
            ],
        },
    ]

    for site in ensotek_sites:
        story.append(KeepTogether([
            p(f'{site["name"]} — {site["label"]}', S_SECTION),
        ]))

        meta_row = [
            [p('<b>Genel Ortalama</b>', S_TABLE_CELL),
             p(f'<b>{site["avg"]:.1f} / 10</b>', ParagraphStyle(
                 'avg2', fontName='Helvetica-Bold', fontSize=11,
                 textColor=score_color(site["avg"]), leading=14)),
             p('<b>Stack:</b>', S_TABLE_CELL),
             p(site["stack"], S_TABLE_CELL)],
        ]
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        mt = Table(meta_row, colWidths=[avail_w*0.18, avail_w*0.14, avail_w*0.1, avail_w*0.58])
        mt.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EDF4FB')),
            ('BOX', (0,0), (-1,-1), 1, ENSOTEK_CYAN),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('FONTSIZE', (0,0), (-1,-1), 9),
        ]))
        story.append(mt)
        story.append(sp(6))

        # Alan puanları
        area_data = [[p('Alan', S_TABLE_HEADER), p('Puan', S_TABLE_HEADER), p('Değerlendirme', S_TABLE_HEADER)]]
        for i, (area, score) in enumerate(zip(AREAS, site['scores'])):
            area_data.append([
                p(area, S_TABLE_CELL),
                colored_score(score),
                p(score_label(score), ParagraphStyle(
                    'sl2', fontName='Helvetica', fontSize=8.5,
                    textColor=score_color(score), leading=12, alignment=TA_CENTER)),
            ])
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        at = Table(area_data, colWidths=[avail_w*0.55, avail_w*0.18, avail_w*0.27], repeatRows=1)
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), ENSOTEK_BLUE),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, colors.HexColor('#EDF6FF')]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#C8D8EE')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ]))
        story.append(at)
        story.append(sp(8))

        # Güçlü & Zayıf
        max_rows = max(len(site['strong']), len(site['weak']))
        sw_data = [
            [p('✓ Güçlü Yanlar', ParagraphStyle(
                'gw_h2', fontName='Helvetica-Bold', fontSize=9,
                textColor=ACCENT_GREEN, leading=12)),
             p('✗ Zayıf Yanlar / Riskler', ParagraphStyle(
                 'zw_h2', fontName='Helvetica-Bold', fontSize=9,
                 textColor=ACCENT_RED, leading=12))],
        ]
        for i in range(max_rows):
            s = site['strong'][i] if i < len(site['strong']) else ''
            w_ = site['weak'][i] if i < len(site['weak']) else ''
            sw_data.append([
                p(f'• {s}' if s else '', S_BODY_SMALL),
                p(f'• {w_}' if w_ else '', S_BODY_SMALL),
            ])
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        sw = Table(sw_data, colWidths=[avail_w*0.5 - 3, avail_w*0.5 - 3])
        sw.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor('#F0FAF4')),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor('#FDF2F2')),
            ('ROWBACKGROUNDS', (0,1), (0,-1), [WHITE, colors.HexColor('#F8FDF9')]),
            ('ROWBACKGROUNDS', (1,1), (1,-1), [WHITE, colors.HexColor('#FEF9F9')]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D8E8F0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('LINEAFTER', (0,0), (0,-1), 1, ENSOTEK_CYAN),
        ]))
        story.append(sw)
        story.append(sp(10))

        # Aksiyon kutusu
        action_data = [[
            p('Öncelik', S_TABLE_HEADER),
            p('Yapılacak İşlem', S_TABLE_HEADER),
        ]]
        for (tag, color, action) in site['actions']:
            action_data.append([
                Paragraph(f'<b>{tag}</b>', ParagraphStyle(
                    'atag', fontName='Helvetica-Bold', fontSize=7.5,
                    textColor=WHITE, alignment=TA_CENTER, leading=10,
                    backColor=color)),
                p(action, S_BODY_SMALL),
            ])
        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        act_t = Table(action_data,
                      colWidths=[avail_w*0.16, avail_w*0.84],
                      repeatRows=1)
        act_t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), ENSOTEK_BLUE),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#C8D8E0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ]))
        story.append(p('Aksiyon Planı', S_SUBSECTION))
        story.append(act_t)
        story.append(sp(20))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 5. KARŞILAŞTIRMALI PUAN TABLOSU
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('5. Karşılaştırmalı Puan Tablosu',
                             'Tüm domainler 8 alanda yan yana')

    avail_w = PAGE_W - MARGIN_L - MARGIN_R
    col_w_label = avail_w * 0.24
    col_w_site  = (avail_w - col_w_label) / 8

    header_row = [p('Alan', S_TABLE_HEADER)] + [
        p(s.replace('ensotek.', 'ensotek\n.'), S_TABLE_HEADER) for s in SITES
    ]

    rows = [header_row]
    for area in AREAS:
        row = [p(area, S_TABLE_CELL)]
        for s, site in enumerate(SITES):
            sc = SCORES[area][s]
            row.append(colored_score(sc))
        rows.append(row)

    # Ortalama satırı
    avg_row = [p('<b>ORTALAMA</b>', ParagraphStyle(
        'avg_r', fontName='Helvetica-Bold', fontSize=8.5, textColor=ENSOTEK_BLUE, leading=12))]
    for site in SITES:
        avg = AVERAGES[site]
        avg_row.append(p(f'<b>{avg:.1f}</b>', ParagraphStyle(
            'avg_rv', fontName='Helvetica-Bold', fontSize=9.5,
            textColor=score_color(avg), leading=12, alignment=TA_CENTER)))
    rows.append(avg_row)

    full_table = Table(rows,
                       colWidths=[col_w_label] + [col_w_site]*8,
                       repeatRows=1)
    full_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [WHITE, LIGHT_BLUE]),
        # Ensotek kolonları hafif vurgu
        ('BACKGROUND', (5,1), (8,-1), colors.HexColor('#EDF4FB')),
        # Ortalama satırı
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#E8F0FA')),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#C8D8E0')),
        # Rakip/Ensotek ayırıcı dikey çizgi
        ('LINEAFTER', (4,0), (4,-1), 2, ENSOTEK_CYAN),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('FONTSIZE', (0,0), (-1,-1), 8),
    ]))
    story.append(full_table)
    story.append(sp(6))
    story.append(p(
        'Mavi dikey çizgi solunu Rakipler, sağını Ensotek domainleri göstermektedir. '
        'kuhlturm.com tüm domainler arasında en yüksek puanı almıştır (6.3/10). '
        'F. GEO/AI Görünürlük alanında sektörün tamamı (rakipler + Ensotek) 1–3/10 bandında kalmaktadır.',
        S_NOTE))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 6. KRİTİK BULGULAR & FIRSAT HARİTASI
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('6. Kritik Bulgular & Fırsat Haritası')

    story.append(p('6.1 Sektör Geneli Kör Noktalar', S_SECTION))
    story.append(p(
        'Aşağıdaki sorunlar hem rakiplerde hem Ensotek domainlerinde ortaklaşa '
        'tespit edilmiştir. Bu alanlarda yapılacak iyileştirmeler Ensotek\'e '
        'sektörde rekabetsiz dijital üstünlük sağlar.'))
    story.append(sp(6))

    sector_blind = [
        ('GEO/AI Görünürlük', ACCENT_RED,
         '8 siteden 8\'inde llms.txt yok. 8\'inde JSON-LD schema ya tamamen yok ya hatalı. '
         'yolyapi.com.tr tüm AI botları (GPTBot, ClaudeBot, Google-Extended) Cloudflare varsayılanıyla engellemiş. '
         'ChatGPT, Perplexity, Claude, Google AI Overviews hiçbir rakibi kaynak göstermiyor. '
         'Sektörde ilk llms.txt + Organization schema ekleyen marka AI aramalarında rakipsiz konum kazanır.'),
        ('WhatsApp Entegrasyonu', ACCENT_ORANGE,
         'Analiz edilen 8 siteden hiçbirinde çalışan, tıklanabilir floating WhatsApp butonu yok. '
         'Türkiye B2B pazarında WhatsApp satış sürecinin standart bir parçası haline gelmiş. '
         'Bu tek iyileştirme bile dönüşüm oranını ölçülebilir artırır.'),
        ('H1 Etiket Disiplini', ACCENT_ORANGE,
         '8 siteden 5\'inde (niba, yolyapi, ctpmuhendislik, ensotek.com.tr) '
         'ana sayfada H1 etiketi ya yok ya title\'ın birebir kopyası. '
         'Google\'ın sayfanın konusunu anlaması için temel SEO sinyali kaçırılıyor.'),
        ('PDF Katalog Lead Capture', MID_GRAY,
         'Katalog PDF\'i olan sitelerin tamamı onu lead capture olmadan sunuyor. '
         'E-posta karşılığı katalog indirme modeli B2B\'nin en verimli lead generation aracı. '
         'Şu an tüm rakipler bu fırsatı kaçırıyor.'),
        ('Blog Aktifliği', MID_GRAY,
         'niba 2018\'de, yolyapi hiç makale üretmeden; cenk son makalesi Eylül 2025, '
         'ctp düzensiz. ensotek.com.tr\'de blog yok. kuhlturm.com\'da yalnızca 3 makale. '
         'İnternetleşen B2B alıcı satın alma kararı öncesinde araştırma yapıyor. '
         'Düzenli teknik içerik organik trafik ve otorite inşasının temel taşı.'),
    ]

    for (title, color, text) in sector_blind:
        box_data = [[
            Paragraph(title, ParagraphStyle(
                'blind_t', fontName='Helvetica-Bold', fontSize=9,
                textColor=color, leading=12)),
            Paragraph(text, S_BODY_SMALL),
        ]]
        b = Table(box_data, colWidths=[3.0*cm, PAGE_W - MARGIN_L - MARGIN_R - 3.0*cm - 0.6*cm])
        b.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_GRAY),
            ('LINEBEFORE', (0,0), (0,-1), 3, color),
            ('TOPPADDING', (0,0), (-1,-1), 7),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOX', (0,0), (-1,-1), 0.4, colors.HexColor('#D8E0E8')),
        ]))
        story.append(b)
        story.append(sp(4))

    story.append(sp(8))
    story.append(p('6.2 Ensotek\'e Özel Kritik Riskler', S_SECTION))

    ensotek_risks = [
        ('🔴 YASAL RİSK — Almanya Impressum', ACCENT_RED,
         'ensotek.de iletişim ve Impressum sayfasında fiziksel adres, yetkili kişi adı, '
         'USt-IdNr (KDV numarası) ve kayıt mahkemesi bilgisi bulunmuyor. '
         'Almanya\'da TMG §5 gereği ticari web sitelerinde bu bilgilerin açıkça yayınlanması zorunlu. '
         'Yaptırım: uyarı mektubu (Abmahnung) ve 1.000–10.000 Euro para cezası. Acil düzeltme gerekiyor.'),
        ('🔴 TEKNİK RİSK — CSR / Googlebot', ACCENT_RED,
         'ensotek.de\'de ürün, blog, ekip, proje, SSS sayfaları JavaScript ile render ediliyor (CSR). '
         'Googlebot bu sayfaların içeriğini görmüyor. Yani SEO\'ya yapılan tüm yatırım (içerik, '
         'link building, teknik yapı) bu sayfalarda boşa gidiyor. '
         'Next.js SSR veya SSG\'ye geçiş acil önceliktir.'),
        ('🔴 STRATEJİK RİSK — Bölünmüş Link Authority', ACCENT_RED,
         'ensotek.com (2006\'dan beri aktif, 411 URL, 3 dil) ensotek.de\'ye 301 redirect yapmıyor. '
         '20 yıllık domain authority, backlink geçmişi ve Google güveni ikiye bölünmüş. '
         'Her iki sitenin backlink\'leri birleştirilseydi ensotek.de çok daha güçlü SERP konumunda olurdu. '
         'Ayrıca: ensotek.com terk edilirse bu değerli domain rakibin eline geçebilir.'),
        ('🟡 İÇERİK RİSKİ — Boş Referanslar Sayfası', ACCENT_ORANGE,
         'ensotek.com.tr\'de referanslar sayfası tamamen boş. '
         '"3000+ kurulum, 40+ ülke" iddiası yapılıyor ama tek bir proje logosu yok. '
         'B2B satış sürecinde sosyal kanıt en kritik karar faktörüdür. '
         'Bu çelişki potansiyel müşteriyi doğrudan rakibe yönlendirir.'),
    ]

    for (title, color, text) in ensotek_risks:
        box_data = [[
            Paragraph(title, ParagraphStyle(
                'er_t', fontName='Helvetica-Bold', fontSize=9,
                textColor=WHITE, leading=12, alignment=TA_CENTER)),
            Paragraph(text, S_BODY_SMALL),
        ]]
        b = Table(box_data, colWidths=[3.5*cm, PAGE_W - MARGIN_L - MARGIN_R - 3.5*cm - 0.6*cm])
        b.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), color),
            ('BACKGROUND', (1,0), (1,-1), LIGHT_GRAY),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOX', (0,0), (-1,-1), 0.4, colors.HexColor('#C8D0D8')),
            ('LINEAFTER', (0,0), (0,-1), 3, color),
        ]))
        story.append(b)
        story.append(sp(5))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 7. TEKNİK AKSİYON PLANI
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('7. Teknik Aksiyon Planı',
                             'Öncelik sıralı — Faz 0 (Bu Hafta) → Faz 3 (Ay 2–3)')

    story.append(p(
        'Aksiyon planı dört faza ayrılmıştır. Faz 0 kritik ve/veya yasal gerektiren işlemleri, '
        'sonraki fazlar ise SEO, GEO, içerik ve dönüşüm iyileştirmelerini kapsar. '
        'Her satırda etkilenen domain(ler) ve beklenen kazanım belirtilmiştir.'))
    story.append(sp(8))

    fazlar = [
        {
            'faz': 'FAZ 0 — Bu Hafta (Kritik & Yasal)',
            'color': ACCENT_RED,
            'items': [
                ('1', 'ensotek.de Impressum', 'ensotek.de',
                 'Adres, yetkili adı, USt-IdNr, kayıt mahkemesi ekle. TMG §5 zorunluluğu.',
                 'Yasal risk ortadan kalkar'),
                ('2', 'ensotek.de İletişim Sayfası', 'ensotek.de',
                 'Fiziksel adres, telefon, e-posta ekle. Şu an iletişim sayfasında hiçbiri yok.',
                 'Güven + yasal uyum'),
                ('3', 'ensotek.de CSR → SSR/SSG', 'ensotek.de',
                 'Ürünler, blog, ekip, projeler, SSS sayfaları Next.js SSR ya da generateStaticParams ile statik üretilmeli.',
                 'Googlebot tüm içeriği görür'),
                ('4', 'Title Tag Duplikasyon', 'ensotek.com.tr',
                 '"Ensotek — Başlık | Ensotek" → "Başlık — Ensotek" formatına getir.',
                 'SERP görünürlüğü düzelir'),
                ('5', 'ensotek.com.tr Referanslar', 'ensotek.com.tr',
                 'En az 15 gerçek müşteri logosu + proje adı + sektör ekle.',
                 'Dönüşüm engeli kaldırılır'),
            ],
        },
        {
            'faz': 'FAZ 1 — 2–3 Hafta (SEO Temeli)',
            'color': ACCENT_ORANGE,
            'items': [
                ('6', 'Meta Description', 'Tüm domainler',
                 'Her iç sayfa için özgün 150–160 karakter meta description. Özellikle ürün ve referans sayfaları.',
                 'Organik CTR artar'),
                ('7', 'Hreflang Etiketleri', 'ensotek.de, ensotek.com.tr',
                 'TR/EN/DE alternatifleri <head> içinde ve sitemap\'te koordineli olarak işaretlenmeli.',
                 'Dil/ülke hedeflemesi doğrulanır'),
                ('8', 'URL Slug Düzeltmesi', 'ensotek.de, ensotek.com.tr',
                 'ensotek.de: /about → /ueber-uns, /contact → /kontakt. ensotek.com.tr: /tr/products → /tr/urunler',
                 'Yerel dil SEO kazancı'),
                ('9', 'Almanca Umlaut — Title/Meta', 'ensotek.de',
                 '"Kuehltuerme" → "Kühltürme", "Kuehlturm" → "Kühlturm". Tüm title ve meta açıklamalarda.',
                 'Almanca arama eşleşmesi'),
                ('10', 'Navigasyon Almancalaştırma', 'ensotek.de',
                 '"About Us" → "Über uns", "Contact" → "Kontakt". Menü tutarsızlığı giderilir.',
                 'Marka tutarlılığı + DE SEO'),
                ('11', 'JSON-LD Organization Schema', 'Tüm domainler',
                 'name, url, logo, telephone, address, foundingDate, numberOfEmployees, sameAs (sosyal medya)',
                 'Google Knowledge Panel + AI görünürlük'),
                ('12', 'JSON-LD Product Schema', 'ensotek.de, kuhlturm.com, ensotek.com.tr',
                 'Her ürün sayfasına: name, description, brand, manufacturer, category',
                 'Ürün aramalarında yapılandırılmış görünüm'),
                ('13', 'JSON-LD FAQPage Schema', 'ensotek.de, ensotek.com.tr',
                 'Mevcut SSS bölümlerine FAQPage markup ekle.',
                 'Featured Snippet (Öne Çıkan Snippet) fırsatı'),
                ('14', 'Canonical Tag', 'ensotek.com',
                 'ensotek.com tüm sayfalarına self-referencing canonical ekle. Cross-domain ilişki için ensotek.de\'ye canonical.',
                 'Duplicate content riski azalır'),
            ],
        },
        {
            'faz': 'FAZ 2 — Ay 1 (GEO + Dönüşüm)',
            'color': ENSOTEK_CYAN,
            'items': [
                ('15', 'llms.txt Dosyası', 'Tüm domainler',
                 'Her domainin kök dizinine llms.txt ekle: şirket açıklaması, ürünler, hizmetler, iletişim özetleri.',
                 'ChatGPT, Claude, Perplexity görünürlüğü'),
                ('16', 'AI Bot Robots.txt Direktifleri', 'Tüm domainler',
                 'GPTBot, ClaudeBot, PerplexityBot, Google-Extended için açık Allow direktifi ekle.',
                 'AI tarayıcılar içeriği aktif indeksler'),
                ('17', 'WhatsApp Floating Butonu', 'ensotek.com.tr, kuhlturm.com',
                 '+90 531 880 31 51 numarası ile wa.me linki, sağ alt köşede sticky buton.',
                 'Türkiye pazarı dönüşümü artar'),
                ('18', 'Sosyal Medya Linkleri', 'ensotek.com.tr',
                 'LinkedIn, YouTube, Instagram, Facebook linkleri footer\'a ekle. LinkedIn öncelikli.',
                 'B2B otorite ve keşfedilebilirlik'),
                ('19', 'PDF Katalog Lead Capture', 'ensotek.com.tr, kuhlturm.com',
                 'PDF katalog indirme için e-posta + şirket adı formu. CRM\'e otomatik kayıt.',
                 'Lead generation başlar'),
                ('20', 'Blog Kurulumu — TR', 'ensotek.com.tr',
                 'Aylık en az 2 makale: "Soğutma Kulesi Seçim Rehberi", "Legionella Önleme", "CTP vs FRP Karşılaştırması"',
                 'Organik trafik + TR SEO otoritesi'),
                ('21', 'Blog Frekansı — DE', 'kuhlturm.com',
                 'Haftada 1 Almanca teknik makale. Kühlturm Wartung, Energieeffizienz, SCADA konuları öncelikli.',
                 'Almanca SEO otoritesi'),
                ('22', 'Google Business Profile', 'ensotek.de (DE), ensotek.com.tr (TR)',
                 'TR: İstanbul + Ankara lokasyonları. DE: Almanya temsilciliği (varsa) veya ihracat kaydı.',
                 'Yerel arama görünürlüğü'),
            ],
        },
        {
            'faz': 'FAZ 3 — Ay 2–3 (Otorite & Büyüme)',
            'color': ACCENT_GREEN,
            'items': [
                ('23', 'Gerçek Testimonial Toplama', 'ensotek.com.tr',
                 'Minimum 6 müşteri: Firma adı + yetkili adı + pozisyon + fotoğraf + alıntı. Tercihen tanınan markalar.',
                 'Güven sinyali güçlenir'),
                ('24', 'Teknik Datasheet Sayfası', 'ensotek.com.tr, kuhlturm.com',
                 'Ürün başına PDF datasheet: kapasite tablosu, ağırlık, boyut, gürültü değeri, enerji tüketimi.',
                 'B2B satın alma süreci desteklenir'),
                ('25', 'Kapasite Hesaplama Aracı', 'ensotek.com.tr',
                 'Soğutma kapasitesi hesaplayıcı: debı, giriş/çıkış sıcaklığı, yaş termometre. Sonuç karşılığı teklif formu.',
                 'Mühendis lead\'leri yakalanır'),
                ('26', 'BreadcrumbList Schema', 'Tüm domainler',
                 'Tüm iç sayfalara gezinti izi schema\'sı. Arama sonucunda alt link görünümü.',
                 'SERP CTR artar'),
                ('27', 'İngilizce Versiyon', 'kuhlturm.com',
                 'Almanya\'daki uluslararası müşteriler için /en/ versiyon. Önce: ürünler + iletişim sayfaları.',
                 'Almanya uluslararası B2B erişimi'),
                ('28', 'LinkedIn İçerik Stratejisi', 'Tüm marka',
                 'Aylık 4 LinkedIn paylaşımı: fuar, proje tamamlama, teknik bilgi, ekip tanıtımı.',
                 'B2B karar vericilere ulaşım'),
                ('29', 'ensotek.com Stratejik Karar', 'ensotek.com',
                 'TR pazarı için tutulacaksa: Cross-domain canonical + hreflang koordinasyonu + PHP → modern framework migration.',
                 'Bölünmüş authority konsolide edilir'),
                ('30', 'Core Web Vitals Denetimi', 'Tüm domainler',
                 'PageSpeed Insights + Chrome UX Report ile LCP, CLS, INP ölçümü. GIF animasyonları video/Lottie ile değiştir.',
                 'Teknik SEO skoru iyileşir'),
            ],
        },
    ]

    for faz in fazlar:
        story.append(p(faz['faz'], ParagraphStyle(
            'faz_h', fontName='Helvetica-Bold', fontSize=11,
            textColor=WHITE, leading=16,
            backColor=faz['color'],
            leftIndent=-4, rightIndent=-4,
            spaceBefore=10, spaceAfter=4,
            borderPad=6)))

        action_header = [
            p('#', S_TABLE_HEADER),
            p('Görev', S_TABLE_HEADER),
            p('Domain', S_TABLE_HEADER),
            p('Yapılacak İşlem', S_TABLE_HEADER),
            p('Beklenen Kazanım', S_TABLE_HEADER),
        ]
        action_rows = [action_header]
        for item in faz['items']:
            action_rows.append([
                p(f'<b>{item[0]}</b>', ParagraphStyle(
                    'anum', fontName='Helvetica-Bold', fontSize=9,
                    textColor=faz['color'], leading=12, alignment=TA_CENTER)),
                p(f'<b>{item[1]}</b>', S_BODY_SMALL),
                p(item[2], ParagraphStyle(
                    'dom', fontName='Helvetica', fontSize=7.5,
                    textColor=ENSOTEK_BLUE, leading=10)),
                p(item[3], S_BODY_SMALL),
                p(item[4], ParagraphStyle(
                    'gain', fontName='Helvetica-Oblique', fontSize=7.5,
                    textColor=ACCENT_GREEN, leading=10)),
            ])

        avail_w = PAGE_W - MARGIN_L - MARGIN_R
        at = Table(action_rows,
                   colWidths=[avail_w*0.04, avail_w*0.18, avail_w*0.14,
                               avail_w*0.42, avail_w*0.22],
                   repeatRows=1)
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), faz['color']),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_BLUE]),
            ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0D8E0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('FONTSIZE', (0,0), (-1,-1), 8),
        ]))
        story.append(at)
        story.append(sp(10))

    story.append(PageBreak())

    # ═══════════════════════════════════════════════════════════════════
    # 8. SONUÇ
    # ═══════════════════════════════════════════════════════════════════
    story += chapter_header('8. Sonuç & Stratejik Değerlendirme')

    story.append(p(
        'Ensotek, 40 yılı aşkın sektörel deneyimi, uluslararası sertifikasyon profili ve '
        'geniş referans portföyüyle sektörün en köklü oyuncularından biridir. '
        'Ancak bu güçlü kurumsal kimlik, dijital ortamda tam potansiyeliyle yansıtılamamaktadır. '
        'Rakipler de dijital açıdan zayıf konumda (sektör ortalaması 4.7/10) olmakla birlikte, '
        'bu durum Ensotek\'in avantajını artıran değil, tüm sektörün dijital dönüşümde '
        'geç kaldığını gösteren bir göstergedir.'))
    story.append(sp(8))

    story.append(p('Öncelikli 3 Stratejik Mesaj', S_SECTION))

    msg_data = [
        [p('1', ParagraphStyle('mn', fontName='Helvetica-Bold', fontSize=20,
                                textColor=ENSOTEK_BLUE, alignment=TA_CENTER, leading=26)),
         p('<b>GEO/AI Görünürlük — Sektörde Rakipsiz Olma Fırsatı</b><br/>'
           'Tüm rakipler ve Ensotek\'in tüm domainleri GEO/AI alanında 1–3/10 bandında. '
           'llms.txt + JSON-LD schema ekleyecek ilk marka, ChatGPT, Perplexity, '
           'Claude ve Google AI Overviews aramalarında sektörde tek referans kaynak haline gelir. '
           'Bu, geleneksel SEO\'dan bağımsız, yüksek etkili ve düşük maliyetli bir fırsat.', S_BODY)],
        [p('2', ParagraphStyle('mn2', fontName='Helvetica-Bold', fontSize=20,
                                textColor=ENSOTEK_BLUE, alignment=TA_CENTER, leading=26)),
         p('<b>ensotek.de Teknik Sorunları — Acil Müdahale Gerekiyor</b><br/>'
           'Ana Almanya sitesinin CSR problemi, Impressum eksikliği ve schema yokluğu; '
           'hem yasal risk hem de boşa harcanan SEO yatırımı anlamına geliyor. '
           'Bu üç sorun çözüldüğünde ensotek.de, rakiplerin çoğunun üzerine çıkacak '
           'teknik yapıya sahip olacak (Next.js altyapısı zaten bu kapasiteyi taşıyor).', S_BODY)],
        [p('3', ParagraphStyle('mn3', fontName='Helvetica-Bold', fontSize=20,
                                textColor=ENSOTEK_BLUE, alignment=TA_CENTER, leading=26)),
         p('<b>kuhlturm.com — Mevcut En Güçlü Varlık, Hızla Geliştirilebilir</b><br/>'
           'kuhlturm.com hem rakiplerden hem diğer Ensotek domainlerinden yüksek puan almakta. '
           'Teklif mekanizması, WhatsApp, referanslar ve CTA mimarisi doğru kurulmuş. '
           'GEO/AI optimizasyonu + İngilizce versiyon + blog içeriği eklenmesiyle '
           'Almanya pazarında dominant konuma geçiş gerçekçi ve hızlı bir hedef.', S_BODY)],
    ]

    avail_w = PAGE_W - MARGIN_L - MARGIN_R
    msg_table = Table(msg_data, colWidths=[1.5*cm, avail_w - 1.5*cm])
    msg_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0F6FF')),
        ('LINEBEFORE', (0,0), (0,-1), 4, ENSOTEK_CYAN),
        ('GRID', (0,0), (-1,-1), 0.3, colors.HexColor('#D0DCEE')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [WHITE, colors.HexColor('#EEF4FF')]),
    ]))
    story.append(msg_table)
    story.append(sp(16))

    story.append(hr())
    story.append(sp(8))
    story.append(p(
        f'Bu rapor Nisan 2026 tarihinde Ensotek Kühltürme & Teknolojileri için hazırlanmıştır. '
        f'Analiz yöntemleri: canlı site tarama, robots.txt/sitemap denetimi, HTML kaynak kodu analizi, '
        f'yapılandırılmış veri kontrolü ve içerik değerlendirmesi. '
        f'Puanlar subjektif değerlendirmeye açık olmakla birlikte metodoloji tutarlı biçimde uygulanmıştır. '
        f'Rapor GİZLİDİR — yalnızca Ensotek yönetimi tarafından kullanılmak üzere hazırlanmıştır.',
        S_NOTE))

    # ─── PDF DERLEME ───────────────────────────────────────────────────
    doc.build(
        story,
        onFirstPage=on_first_page,
        onLaterPages=on_page,
    )
    print(f"✓ PDF oluşturuldu: {OUTPUT_PATH}")


if __name__ == '__main__':
    build_pdf()
