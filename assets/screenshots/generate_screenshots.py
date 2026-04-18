#!/usr/bin/env python3
"""Generate 5 App Store screenshots for Fame Life iOS game."""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1290, 2796
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Colors
PURPLE = (147, 51, 234)
PINK = (236, 73, 153)
DARK_BG = (26, 10, 46)
DARKER_BG = (15, 5, 30)
WHITE = (255, 255, 255)
CREAM = (250, 248, 245)
LIGHT_GRAY = (200, 200, 210)
STAT_BAR_BG = (20, 8, 40)
CARD_BG = (255, 255, 255)
CARD_SHADOW = (230, 225, 240)
GOLD = (255, 200, 50)
GREEN = (34, 197, 94)
RED = (239, 68, 68)
BLUE = (59, 130, 246)
ORANGE = (249, 115, 22)

# Fonts
def load_font(size, bold=True):
    try:
        if bold:
            return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", size)
        else:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        return ImageFont.load_default()

font_headline = load_font(82, bold=True)
font_subhead = load_font(44, bold=False)
font_title = load_font(52, bold=True)
font_body = load_font(36, bold=False)
font_body_bold = load_font(36, bold=True)
font_small = load_font(28, bold=False)
font_small_bold = load_font(28, bold=True)
font_tiny = load_font(22, bold=False)
font_stat = load_font(24, bold=True)
font_big_title = load_font(68, bold=True)
font_button = load_font(32, bold=True)
font_emoji = load_font(40, bold=False)
font_large_num = load_font(48, bold=True)
font_achievement = load_font(56, bold=True)

# Phone screen area
PHONE_LEFT = 120
PHONE_RIGHT = W - 120
PHONE_TOP = 520
PHONE_BOTTOM = 2580
PHONE_W = PHONE_RIGHT - PHONE_LEFT
PHONE_H = PHONE_BOTTOM - PHONE_TOP
CORNER_R = 50

def create_gradient_bg(draw, img):
    """Purple to pink gradient background."""
    for y in range(H):
        ratio = y / H
        r = int(PURPLE[0] * (1 - ratio) + PINK[0] * ratio)
        g = int(PURPLE[1] * (1 - ratio) + PINK[1] * ratio)
        b = int(PURPLE[2] * (1 - ratio) + PINK[2] * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

def draw_phone_frame(draw):
    """Draw phone bezel/frame with rounded corners."""
    # Outer bezel (dark border)
    bezel = 8
    draw.rounded_rectangle(
        [PHONE_LEFT - bezel, PHONE_TOP - bezel, PHONE_RIGHT + bezel, PHONE_BOTTOM + bezel],
        radius=CORNER_R + bezel, fill=(40, 40, 50)
    )
    # Inner screen area
    draw.rounded_rectangle(
        [PHONE_LEFT, PHONE_TOP, PHONE_RIGHT, PHONE_BOTTOM],
        radius=CORNER_R, fill=DARK_BG
    )
    # Notch
    notch_w = 220
    notch_h = 34
    notch_x = (PHONE_LEFT + PHONE_RIGHT) // 2 - notch_w // 2
    draw.rounded_rectangle(
        [notch_x, PHONE_TOP, notch_x + notch_w, PHONE_TOP + notch_h],
        radius=14, fill=(30, 30, 40)
    )

def draw_headline(draw, headline, subheadline):
    """Draw marketing text at the top."""
    # Headline
    bbox = draw.textbbox((0, 0), headline, font=font_headline)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 180), headline, fill=WHITE, font=font_headline)
    # Sub-headline
    bbox = draw.textbbox((0, 0), subheadline, font=font_subhead)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 300), subheadline, fill=(255, 255, 255, 200), font=font_subhead)

def draw_stat_bar(draw, y_offset):
    """Draw the game's top stat bar inside phone screen."""
    sx, sy = PHONE_LEFT + 20, PHONE_TOP + 50 + y_offset
    bar_w = PHONE_W - 40
    bar_h = 60
    draw.rounded_rectangle([sx, sy, sx + bar_w, sy + bar_h], radius=12, fill=STAT_BAR_BG)

    # Stats
    stats = [
        ("👥 35.9K", (255, 180, 220)),
        ("💰 $4.6K", (180, 255, 180)),
        ("⭐ 32", (255, 220, 100)),
    ]
    stat_w = bar_w // 3
    for i, (text, color) in enumerate(stats):
        tx = sx + stat_w * i + 25
        draw.text((tx, sy + 14), text, fill=color, font=font_stat)

def draw_card(draw, x, y, w, h, title=None, content_lines=None, has_shadow=True):
    """Draw a white card with optional title and content."""
    if has_shadow:
        draw.rounded_rectangle([x + 4, y + 4, x + w + 4, y + h + 4], radius=18, fill=(10, 5, 25))
    draw.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=CARD_BG)
    cy = y + 20
    if title:
        draw.text((x + 24, cy), title, fill=DARK_BG, font=font_body_bold)
        cy += 50
    if content_lines:
        for line, color in content_lines:
            draw.text((x + 24, cy), line, fill=color, font=font_small)
            cy += 36
    return cy

def draw_gradient_button(draw, x, y, w, h, text, font=font_button):
    """Draw a gradient purple-pink button."""
    # Button background gradient (simplified as solid purple-pink)
    for row in range(h):
        ratio = row / h
        r = int(PURPLE[0] * (1 - ratio) + PINK[0] * ratio)
        g = int(PURPLE[1] * (1 - ratio) + PINK[1] * ratio)
        b = int(PURPLE[2] * (1 - ratio) + PINK[2] * ratio)
        # Only draw within rounded rect bounds
        if row < 12 or row > h - 12:
            continue
        draw.line([(x + 8, y + row), (x + w - 8, y + row)], fill=(r, g, b))
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, outline=None, fill=None)
    # Redraw as proper rounded rect
    for row in range(h):
        ratio = row / h
        r = int(PURPLE[0] * (1 - ratio) + PINK[0] * ratio)
        g = int(PURPLE[1] * (1 - ratio) + PINK[1] * ratio)
        b = int(PURPLE[2] * (1 - ratio) + PINK[2] * ratio)
        draw.line([(x, y + row), (x + w, y + row)], fill=(r, g, b))
    # Re-clip corners
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=None, outline=None)

    # Actually draw a proper gradient button using a mask approach
    # Simplify: just draw the rounded rect with a mid-gradient color
    mid_color = (
        (PURPLE[0] + PINK[0]) // 2,
        (PURPLE[1] + PINK[1]) // 2,
        (PURPLE[2] + PINK[2]) // 2,
    )
    draw.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=mid_color)

    # Text
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((x + (w - tw) // 2, y + (h - th) // 2 - 2), text, fill=WHITE, font=font)


def create_screenshot_1():
    """Build Your Fame Empire - Start screen."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, img)
    draw_headline(draw, "Build Your Fame Empire", "From zero to millions of followers")
    draw_phone_frame(draw)

    # Inside phone: start screen
    sx, sy = PHONE_LEFT, PHONE_TOP
    pw, ph = PHONE_W, PHONE_H

    # Dark purple gradient inside phone
    for y in range(ph):
        ratio = y / ph
        r = int(26 * (1 - ratio) + 60 * ratio)
        g = int(10 * (1 - ratio) + 10 * ratio)
        b = int(46 * (1 - ratio) + 80 * ratio)
        draw.line([(sx + 10, sy + y), (sx + pw - 10, sy + y)], fill=(r, g, b))

    # Re-clip with rounded rect
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=CORNER_R, outline=None)

    # Decorative circles (subtle)
    for cx, cy, cr in [(sx + 200, sy + 400, 180), (sx + pw - 150, sy + 800, 120), (sx + 300, sy + 1500, 150)]:
        draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(80, 30, 100, 30), outline=None)

    # FAME LIFE title
    title_text = "FAME LIFE"
    bbox = draw.textbbox((0, 0), title_text, font=load_font(96, bold=True))
    tw = bbox[2] - bbox[0]
    title_x = sx + (pw - tw) // 2
    title_y = sy + 500
    # Glow effect
    for offset in range(6, 0, -1):
        glow_color = (200, 100, 255, 30)
        draw.text((title_x - offset, title_y), title_text, fill=(150, 50, 200), font=load_font(96, bold=True))
    draw.text((title_x, title_y), title_text, fill=WHITE, font=load_font(96, bold=True))

    # Subtitle
    sub = "Influencer Simulator"
    bbox = draw.textbbox((0, 0), sub, font=font_body)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, title_y + 120), sub, fill=(200, 180, 255), font=font_body)

    # Star icons decorative
    stars = "✨ ⭐ 🌟 ✨"
    bbox = draw.textbbox((0, 0), stars, font=font_body)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, title_y + 200), stars, fill=GOLD, font=font_body)

    # Follower count display
    count_y = title_y + 320
    draw.rounded_rectangle(
        [sx + 150, count_y, sx + pw - 150, count_y + 120],
        radius=20, fill=(40, 15, 70)
    )
    fc_text = "0 Followers"
    bbox = draw.textbbox((0, 0), fc_text, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, count_y + 30), fc_text, fill=(200, 180, 255), font=font_title)

    # Start button
    btn_w = 550
    btn_h = 80
    btn_x = sx + (pw - btn_w) // 2
    btn_y = count_y + 200
    draw_gradient_button(draw, btn_x, btn_y, btn_w, btn_h, "Start Your Fame Story")

    # Bottom decorative text
    draw.text((sx + (pw - 300) // 2, btn_y + 140), "Choose your path to fame", fill=(150, 130, 180), font=font_small)

    # Version
    draw.text((sx + (pw - 60) // 2, sy + ph - 80), "v1.0", fill=(100, 80, 130), font=font_tiny)

    img.save(os.path.join(OUTPUT_DIR, "screenshot-1.png"))
    print("Screenshot 1 saved.")


def create_screenshot_2():
    """Make Every Choice Count - Drama event card."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, img)
    draw_headline(draw, "Make Every Choice Count", "100+ story events shape your career")
    draw_phone_frame(draw)

    sx, sy = PHONE_LEFT, PHONE_TOP
    pw, ph = PHONE_W, PHONE_H

    # Phone bg
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=CORNER_R, fill=DARK_BG)

    # Stat bar
    draw_stat_bar(draw, 0)

    # Quarter label
    draw.text((sx + 30, sy + 130), "Q2 Year 1", fill=(180, 160, 220), font=font_small_bold)

    # Event card - dramatic overlay
    card_x = sx + 40
    card_y = sy + 200
    card_w = pw - 80
    card_h = 1500

    # Card with dark overlay feel
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill=CARD_BG)

    # Event type badge
    badge_w = 180
    draw.rounded_rectangle([card_x + 30, card_y + 30, card_x + 30 + badge_w, card_y + 70], radius=12, fill=(254, 215, 170))
    draw.text((card_x + 50, card_y + 38), "🔥 DRAMA", fill=(180, 80, 0), font=font_small_bold)

    # Event title
    draw.text((card_x + 30, card_y + 100), "Hot Mic Moment", fill=DARK_BG, font=load_font(50, bold=True))

    # Event description
    desc_lines = [
        "During a live stream, your microphone",
        "picks up a private conversation where",
        "you're venting about another creator.",
        "",
        "The clip is already going viral.",
        "How do you respond?"
    ]
    dy = card_y + 180
    for line in desc_lines:
        draw.text((card_x + 30, dy), line, fill=(80, 70, 90), font=font_body)
        dy += 44

    # Impact preview
    dy += 20
    draw.rounded_rectangle([card_x + 30, dy, card_x + card_w - 30, dy + 80], radius=12, fill=(245, 240, 255))
    draw.text((card_x + 50, dy + 10), "⚠️ Impact:", fill=PURPLE, font=font_small_bold)
    draw.text((card_x + 50, dy + 42), "High Risk / High Reward", fill=(120, 100, 150), font=font_small)

    # Choice A button
    choice_y = dy + 120
    draw.rounded_rectangle([card_x + 30, choice_y, card_x + card_w - 30, choice_y + 160], radius=18, fill=(240, 253, 244))
    draw.rounded_rectangle([card_x + 30, choice_y, card_x + card_w - 30, choice_y + 160], radius=18, outline=(34, 197, 94), width=2)
    draw.text((card_x + 55, choice_y + 18), "A: Own It & Apologize", fill=(22, 101, 52), font=font_body_bold)
    draw.text((card_x + 55, choice_y + 65), "Post a heartfelt apology video.", fill=(80, 80, 80), font=font_small)
    draw.text((card_x + 55, choice_y + 100), "📈 Followers +5%   💚 Fame +3", fill=(34, 150, 80), font=font_small)
    draw.text((card_x + 55, choice_y + 130), "💰 -$500 (charity donation)", fill=(180, 80, 80), font=font_small)

    # Choice B button
    choice_y2 = choice_y + 200
    draw.rounded_rectangle([card_x + 30, choice_y2, card_x + card_w - 30, choice_y2 + 160], radius=18, fill=(254, 242, 242))
    draw.rounded_rectangle([card_x + 30, choice_y2, card_x + card_w - 30, choice_y2 + 160], radius=18, outline=(239, 68, 68), width=2)
    draw.text((card_x + 55, choice_y2 + 18), "B: Double Down", fill=(153, 27, 27), font=font_body_bold)
    draw.text((card_x + 55, choice_y2 + 65), "Lean into the drama for clout.", fill=(80, 80, 80), font=font_small)
    draw.text((card_x + 55, choice_y2 + 100), "📈 Followers +15%  🔥 Viral!", fill=(200, 50, 50), font=font_small)
    draw.text((card_x + 55, choice_y2 + 130), "⭐ Fame -5   ⚠️ Reputation risk", fill=(180, 80, 80), font=font_small)

    # Timer bar at bottom of card
    timer_y = card_y + card_h - 60
    draw.rounded_rectangle([card_x + 30, timer_y, card_x + card_w - 30, timer_y + 8], radius=4, fill=(230, 225, 240))
    draw.rounded_rectangle([card_x + 30, timer_y, card_x + 400, timer_y + 8], radius=4, fill=PURPLE)
    draw.text((card_x + 30, timer_y + 16), "⏱ Choose within this quarter", fill=(150, 140, 170), font=font_tiny)

    img.save(os.path.join(OUTPUT_DIR, "screenshot-2.png"))
    print("Screenshot 2 saved.")


def create_screenshot_3():
    """Grow Your Income - Quarterly income breakdown."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, img)
    draw_headline(draw, "Grow Your Income", "6 revenue streams to master")
    draw_phone_frame(draw)

    sx, sy = PHONE_LEFT, PHONE_TOP
    pw, ph = PHONE_W, PHONE_H

    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=CORNER_R, fill=DARK_BG)
    draw_stat_bar(draw, 0)

    # Quarter income header
    header_y = sy + 140
    draw.rounded_rectangle([sx + 30, header_y, sx + pw - 30, header_y + 140], radius=20, fill=(40, 18, 70))
    draw.text((sx + 60, header_y + 15), "💰 Q3 Income Report", fill=WHITE, font=font_body_bold)
    draw.text((sx + 60, header_y + 65), "$12,847", fill=GREEN, font=load_font(58, bold=True))
    draw.text((sx + 340, header_y + 80), "+34% vs last quarter", fill=(130, 220, 130), font=font_small)

    # Income streams
    streams = [
        ("📱", "Ad Revenue", "$4,200", "+12%", (59, 130, 246), 0.70),
        ("🤝", "Sponsorships", "$3,500", "+45%", (147, 51, 234), 0.58),
        ("❤️", "Donations", "$2,100", "+28%", (236, 73, 153), 0.35),
        ("⭐", "Subscriptions", "$1,800", "+52%", (249, 115, 22), 0.30),
        ("🛍️", "Merch Sales", "$847", "NEW!", (34, 197, 94), 0.14),
        ("🎬", "Brand Deals", "$400", "+5%", (234, 179, 8), 0.07),
    ]

    card_y = header_y + 170
    for i, (emoji, name, amount, change, color, bar_pct) in enumerate(streams):
        cy = card_y + i * 195
        # Card
        draw.rounded_rectangle([sx + 30, cy, sx + pw - 30, cy + 175], radius=18, fill=CARD_BG)

        # Emoji circle
        circle_x = sx + 70
        circle_y = cy + 30
        draw.ellipse([circle_x, circle_y, circle_x + 60, circle_y + 60], fill=(245, 240, 255))
        draw.text((circle_x + 10, circle_y + 8), emoji, fill=DARK_BG, font=font_body)

        # Name and amount
        draw.text((sx + 150, cy + 22), name, fill=DARK_BG, font=font_body_bold)

        # Amount right-aligned
        bbox = draw.textbbox((0, 0), amount, font=font_body_bold)
        tw = bbox[2] - bbox[0]
        draw.text((sx + pw - 70 - tw, cy + 22), amount, fill=DARK_BG, font=font_body_bold)

        # Change badge
        change_color = GREEN if "+" in change or "NEW" in change else RED
        draw.text((sx + 150, cy + 65), change, fill=change_color, font=font_small_bold)

        # Progress bar
        bar_x = sx + 150
        bar_y_pos = cy + 110
        bar_w = pw - 220
        draw.rounded_rectangle([bar_x, bar_y_pos, bar_x + bar_w, bar_y_pos + 16], radius=8, fill=(235, 230, 245))
        draw.rounded_rectangle([bar_x, bar_y_pos, bar_x + int(bar_w * bar_pct), bar_y_pos + 16], radius=8, fill=color)

        # Percentage
        pct_text = f"{int(bar_pct * 100)}%"
        draw.text((bar_x + bar_w + 10, bar_y_pos - 4), pct_text, fill=(140, 130, 160), font=font_tiny)

    # Bottom summary
    sum_y = card_y + 6 * 195 + 20
    draw.rounded_rectangle([sx + 30, sum_y, sx + pw - 30, sum_y + 80], radius=16, fill=(40, 18, 70))
    draw.text((sx + 60, sum_y + 22), "📊 Passive Income Rate: $1,425/quarter", fill=(200, 190, 230), font=font_small_bold)

    img.save(os.path.join(OUTPUT_DIR, "screenshot-3.png"))
    print("Screenshot 3 saved.")


def create_screenshot_4():
    """Upgrade & Expand - Shop screen."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, img)
    draw_headline(draw, "Upgrade & Expand", "Shop for gear, staff & studios")
    draw_phone_frame(draw)

    sx, sy = PHONE_LEFT, PHONE_TOP
    pw, ph = PHONE_W, PHONE_H

    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=CORNER_R, fill=DARK_BG)
    draw_stat_bar(draw, 0)

    # Shop header
    header_y = sy + 130
    draw.text((sx + 40, header_y), "🛒 Creator Shop", fill=WHITE, font=font_title)

    # Balance
    draw.rounded_rectangle([sx + pw - 280, header_y, sx + pw - 30, header_y + 55], radius=14, fill=(40, 18, 70))
    draw.text((sx + pw - 260, header_y + 10), "💰 $4,600", fill=GREEN, font=font_body_bold)

    # Tab bar
    tab_y = header_y + 75
    tabs = ["Gear", "Staff", "Studio", "Perks"]
    tab_w = (pw - 80) // 4
    for i, tab in enumerate(tabs):
        tx = sx + 40 + i * tab_w
        is_active = i == 0
        fill = PURPLE if is_active else (40, 18, 70)
        draw.rounded_rectangle([tx, tab_y, tx + tab_w - 10, tab_y + 50], radius=12, fill=fill)
        bbox = draw.textbbox((0, 0), tab, font=font_small_bold)
        tw = bbox[2] - bbox[0]
        draw.text((tx + (tab_w - 10 - tw) // 2, tab_y + 12), tab, fill=WHITE, font=font_small_bold)

    # Shop items
    items = [
        ("💡", "Ring Light", "$200", "Boost stream quality", "+5% donations", True, GREEN),
        ("📱", "Better Phone", "$500", "Unlock vertical video", "+10% ad revenue", True, BLUE),
        ("📷", "Pro Camera", "$2,000", "Professional content", "+20% sponsorships", True, PURPLE),
        ("🎤", "Studio Mic", "$800", "Crystal clear audio", "+8% subscribers", True, ORANGE),
        ("💻", "Editing Suite", "$3,500", "Advanced post-production", "+15% all income", False, PINK),
        ("🏢", "Home Studio", "$10,000", "Professional setup", "+25% all income", False, (100, 100, 120)),
    ]

    items_y = tab_y + 75
    for i, (emoji, name, price, desc, bonus, affordable, accent) in enumerate(items):
        iy = items_y + i * 195

        # Card
        card_fill = CARD_BG if affordable else (240, 238, 245)
        draw.rounded_rectangle([sx + 30, iy, sx + pw - 30, iy + 178], radius=18, fill=card_fill)

        # Left accent bar
        draw.rounded_rectangle([sx + 30, iy, sx + 38, iy + 178], radius=0, fill=accent)

        # Emoji
        draw.ellipse([sx + 60, iy + 25, sx + 120, iy + 85], fill=(245, 240, 255))
        draw.text((sx + 72, iy + 35), emoji, fill=DARK_BG, font=font_body)

        # Name
        name_color = DARK_BG if affordable else (150, 145, 160)
        draw.text((sx + 140, iy + 20), name, fill=name_color, font=font_body_bold)

        # Description
        draw.text((sx + 140, iy + 65), desc, fill=(120, 115, 135), font=font_small)

        # Bonus
        draw.text((sx + 140, iy + 100), bonus, fill=GREEN if affordable else (150, 200, 150), font=font_small_bold)

        # Price / Buy button
        if affordable:
            btn_x = sx + pw - 220
            btn_y_pos = iy + 30
            draw_gradient_button(draw, btn_x, btn_y_pos, 160, 50, price, font=font_small_bold)
        else:
            # Locked
            bbox = draw.textbbox((0, 0), price, font=font_body_bold)
            tw = bbox[2] - bbox[0]
            draw.text((sx + pw - 80 - tw, iy + 25), price, fill=(180, 170, 195), font=font_body_bold)
            draw.text((sx + pw - 140, iy + 70), "🔒 Locked", fill=(160, 150, 180), font=font_small)

        # Owned check for first item
        if i == 0:
            draw.rounded_rectangle([sx + pw - 200, iy + 100, sx + pw - 60, iy + 140], radius=10, fill=(220, 252, 231))
            draw.text((sx + pw - 185, iy + 106), "✅ Owned", fill=(22, 101, 52), font=font_small_bold)

    img.save(os.path.join(OUTPUT_DIR, "screenshot-4.png"))
    print("Screenshot 4 saved.")


def create_screenshot_5():
    """Earn Your Legacy - Achievement popup."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, img)
    draw_headline(draw, "Earn Your Legacy", "31 achievements to unlock")
    draw_phone_frame(draw)

    sx, sy = PHONE_LEFT, PHONE_TOP
    pw, ph = PHONE_W, PHONE_H

    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=CORNER_R, fill=DARK_BG)
    draw_stat_bar(draw, 0)

    # Achievement popup overlay - semi-transparent dark overlay
    overlay_y = sy + 200
    draw.rounded_rectangle([sx + 10, overlay_y, sx + pw - 10, overlay_y + 900], radius=30, fill=(15, 8, 30))

    # Golden glow border
    draw.rounded_rectangle([sx + 50, overlay_y + 30, sx + pw - 50, overlay_y + 870], radius=24, outline=GOLD, width=3)
    draw.rounded_rectangle([sx + 50, overlay_y + 30, sx + pw - 50, overlay_y + 870], radius=24, fill=(30, 18, 50))

    # Achievement unlocked header
    header_text = "🏆 ACHIEVEMENT UNLOCKED!"
    bbox = draw.textbbox((0, 0), header_text, font=font_body_bold)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, overlay_y + 70), header_text, fill=GOLD, font=font_body_bold)

    # Big achievement badge circle
    badge_cx = sx + pw // 2
    badge_cy = overlay_y + 300
    badge_r = 130
    # Outer ring
    draw.ellipse([badge_cx - badge_r - 8, badge_cy - badge_r - 8, badge_cx + badge_r + 8, badge_cy + badge_r + 8], fill=GOLD)
    draw.ellipse([badge_cx - badge_r, badge_cy - badge_r, badge_cx + badge_r, badge_cy + badge_r], fill=(50, 25, 80))
    # Inner icon
    icon_text = "10K"
    bbox = draw.textbbox((0, 0), icon_text, font=load_font(72, bold=True))
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((badge_cx - tw // 2, badge_cy - th // 2 - 20), icon_text, fill=GOLD, font=load_font(72, bold=True))
    draw.text((badge_cx - 30, badge_cy + 45), "CLUB", fill=(200, 180, 255), font=font_small_bold)

    # Stars around badge
    star_positions = [
        (badge_cx - 180, badge_cy - 80), (badge_cx + 160, badge_cy - 80),
        (badge_cx - 150, badge_cy + 60), (badge_cx + 130, badge_cy + 60),
    ]
    for star_x, star_y in star_positions:
        draw.text((star_x, star_y), "✨", fill=GOLD, font=font_body)

    # Achievement name
    name_text = "10K Club"
    bbox = draw.textbbox((0, 0), name_text, font=font_achievement)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, overlay_y + 490), name_text, fill=WHITE, font=font_achievement)

    # Description
    desc_text = "Reach 10,000 followers"
    bbox = draw.textbbox((0, 0), desc_text, font=font_body)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, overlay_y + 570), desc_text, fill=(180, 170, 210), font=font_body)

    # Reward
    reward_y = overlay_y + 650
    draw.rounded_rectangle([sx + 130, reward_y, sx + pw - 130, reward_y + 70], radius=14, fill=(40, 25, 65))
    reward_text = "🎁 Reward: Gold Profile Badge"
    bbox = draw.textbbox((0, 0), reward_text, font=font_small_bold)
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, reward_y + 20), reward_text, fill=GOLD, font=font_small_bold)

    # Claim button
    btn_w = 350
    btn_x = sx + (pw - btn_w) // 2
    draw_gradient_button(draw, btn_x, overlay_y + 770, btn_w, 65, "🎉 Claim Reward")

    # Background: achievement grid (partially visible behind overlay)
    achievements = [
        ("First Post", "📸", True), ("100 Fans", "👥", True), ("Viral Hit", "🔥", True),
        ("10K Club", "⭐", True), ("Brand Deal", "🤝", True), ("Full-Time", "💼", True),
        ("100K Club", "🏆", False), ("Trendsetter", "📈", False), ("Collab King", "👑", False),
        ("Millionaire", "💎", False), ("Mega Star", "🌟", False), ("Legend", "🎭", False),
    ]

    grid_y = overlay_y + 940
    cols = 3
    cell_w = (pw - 80) // cols
    cell_h = 150

    for i, (name, emoji, unlocked) in enumerate(achievements):
        col = i % cols
        row = i // cols
        cx = sx + 40 + col * cell_w
        cy = grid_y + row * (cell_h + 15)

        if cy > sy + ph - 60:
            break

        fill = (50, 30, 75) if unlocked else (25, 15, 40)
        draw.rounded_rectangle([cx, cy, cx + cell_w - 15, cy + cell_h], radius=14, fill=fill)

        # Emoji
        bbox = draw.textbbox((0, 0), emoji, font=font_body)
        ew = bbox[2] - bbox[0]
        draw.text((cx + (cell_w - 15 - ew) // 2, cy + 20), emoji, fill=WHITE if unlocked else (60, 50, 80), font=font_body)

        # Name
        bbox = draw.textbbox((0, 0), name, font=font_tiny)
        nw = bbox[2] - bbox[0]
        text_color = WHITE if unlocked else (80, 65, 100)
        draw.text((cx + (cell_w - 15 - nw) // 2, cy + 75), name, fill=text_color, font=font_tiny)

        if unlocked:
            draw.text((cx + cell_w - 45, cy + 105), "✅", fill=GREEN, font=font_tiny)
        else:
            draw.text((cx + (cell_w - 15) // 2 - 8, cy + 105), "🔒", fill=(80, 65, 100), font=font_tiny)

    # Progress bar at very bottom
    prog_y = sy + ph - 90
    draw.rounded_rectangle([sx + 40, prog_y, sx + pw - 40, prog_y + 50], radius=14, fill=(30, 15, 50))
    draw.text((sx + 60, prog_y + 10), "Progress: 6/31", fill=(180, 170, 210), font=font_small_bold)
    # Bar
    bar_x = sx + 260
    bar_w = pw - 330
    draw.rounded_rectangle([bar_x, prog_y + 16, bar_x + bar_w, prog_y + 34], radius=9, fill=(50, 30, 75))
    draw.rounded_rectangle([bar_x, prog_y + 16, bar_x + int(bar_w * 6 / 31), prog_y + 34], radius=9, fill=GOLD)

    img.save(os.path.join(OUTPUT_DIR, "screenshot-5.png"))
    print("Screenshot 5 saved.")


if __name__ == "__main__":
    create_screenshot_1()
    create_screenshot_2()
    create_screenshot_3()
    create_screenshot_4()
    create_screenshot_5()
    print(f"\nAll 5 screenshots saved to {OUTPUT_DIR}")
