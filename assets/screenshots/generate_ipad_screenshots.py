#!/usr/bin/env python3
"""Generate 10 iPad App Store screenshots for Fame Life iOS game.
5 screenshots at iPad Pro 13" (2048x2732) and 5 at iPad Pro 11" (1668x2388).
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Colors
PURPLE = (147, 51, 234)       # #9333ea
PURPLE_DARK = (107, 33, 168)  # #6B21A8
PINK = (236, 73, 153)         # #ec4899
DARK_BG = (26, 10, 46)        # #1a0a2e
DARKER_BG = (15, 5, 30)
WHITE = (255, 255, 255)
CARD_BG = (255, 255, 255)
GOLD = (255, 215, 0)          # #FFD700
GREEN = (34, 197, 94)         # #22c55e
RED = (239, 68, 68)           # #ef4444
BLUE = (59, 130, 246)
ORANGE = (249, 115, 22)
STAT_BAR_BG = (20, 8, 40)


def load_font(size, bold=True):
    try:
        if bold:
            return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", size)
        else:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        return ImageFont.load_default()


def make_fonts(scale=1.0):
    s = lambda x: int(x * scale)
    return {
        'headline': load_font(s(88), bold=True),
        'subhead': load_font(s(46), bold=False),
        'title': load_font(s(56), bold=True),
        'body': load_font(s(38), bold=False),
        'body_bold': load_font(s(38), bold=True),
        'small': load_font(s(30), bold=False),
        'small_bold': load_font(s(30), bold=True),
        'tiny': load_font(s(24), bold=False),
        'tiny_bold': load_font(s(24), bold=True),
        'stat': load_font(s(26), bold=True),
        'big_title': load_font(s(72), bold=True),
        'button': load_font(s(34), bold=True),
        'large_num': load_font(s(52), bold=True),
        'achievement': load_font(s(60), bold=True),
        'fame_title': load_font(s(110), bold=True),
        'fame_big': load_font(s(78), bold=True),
        'income_big': load_font(s(62), bold=True),
        'shop_title': load_font(s(54), bold=True),
    }


def create_gradient_bg(draw, W, H):
    """Purple (#6B21A8) to pink (#EC4899) gradient background."""
    for y in range(H):
        ratio = y / H
        r = int(PURPLE_DARK[0] * (1 - ratio) + PINK[0] * ratio)
        g = int(PURPLE_DARK[1] * (1 - ratio) + PINK[1] * ratio)
        b = int(PURPLE_DARK[2] * (1 - ratio) + PINK[2] * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))


def draw_tablet_frame(draw, W, H, frame_left, frame_top, frame_right, frame_bottom, corner_r):
    """Draw tablet frame with rounded corners."""
    bezel = 10
    draw.rounded_rectangle(
        [frame_left - bezel, frame_top - bezel, frame_right + bezel, frame_bottom + bezel],
        radius=corner_r + bezel, fill=(40, 40, 50)
    )
    draw.rounded_rectangle(
        [frame_left, frame_top, frame_right, frame_bottom],
        radius=corner_r, fill=DARK_BG
    )


def draw_headline(draw, W, headline, subheadline, fonts, y_start=140):
    """Draw marketing text at the top."""
    bbox = draw.textbbox((0, 0), headline, font=fonts['headline'])
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y_start), headline, fill=WHITE, font=fonts['headline'])
    bbox = draw.textbbox((0, 0), subheadline, font=fonts['subhead'])
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y_start + 120), subheadline, fill=(230, 220, 255), font=fonts['subhead'])


def draw_gradient_button(draw, x, y, w, h, text, font, radius=16):
    """Draw a gradient purple-pink button."""
    mid_color = (
        (PURPLE[0] + PINK[0]) // 2,
        (PURPLE[1] + PINK[1]) // 2,
        (PURPLE[2] + PINK[2]) // 2,
    )
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=mid_color)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((x + (w - tw) // 2, y + (h - th) // 2 - 2), text, fill=WHITE, font=font)


def draw_stat_bar(draw, sx, sy, pw, fonts, y_offset=0):
    """Draw the game's top stat bar inside tablet screen."""
    bar_x = sx + 30
    bar_y = sy + 40 + y_offset
    bar_w = pw - 60
    bar_h = 65
    draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_w, bar_y + bar_h], radius=14, fill=STAT_BAR_BG)
    stats = [
        ("Followers 35.9K", (255, 180, 220)),
        ("$4.6K", (180, 255, 180)),
        ("Fame 32", (255, 220, 100)),
    ]
    stat_w = bar_w // 3
    for i, (text, color) in enumerate(stats):
        tx = bar_x + stat_w * i + 30
        draw.text((tx, bar_y + 16), text, fill=color, font=fonts['stat'])


# ─── iPad configuration ───

CONFIGS = [
    {"name": "ipad-13", "W": 2048, "H": 2732},
    {"name": "ipad-11", "W": 1668, "H": 2388},
]


def get_frame(cfg):
    """Calculate tablet frame bounds - frame fills most of the image height."""
    W, H = cfg["W"], cfg["H"]
    margin_x = int(W * 0.04)           # 4% side margins
    top = int(H * 0.14)                # 14% from top for headline area
    bottom = H - int(H * 0.035)        # 3.5% bottom margin
    return {
        'left': margin_x,
        'top': top,
        'right': W - margin_x,
        'bottom': bottom,
        'w': W - 2 * margin_x,
        'h': bottom - top,
        'corner_r': 44,
    }


# ─── Screenshot generators ───

def create_screenshot_1(cfg, fonts):
    """Build Your Fame Empire - Start screen."""
    W, H = cfg["W"], cfg["H"]
    f = get_frame(cfg)

    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, W, H)
    draw_headline(draw, W, "Build Your Fame Empire", "From zero to millions of followers", fonts, y_start=int(H * 0.03))
    draw_tablet_frame(draw, W, H, f['left'], f['top'], f['right'], f['bottom'], f['corner_r'])

    sx, sy, pw, ph = f['left'], f['top'], f['w'], f['h']

    # Dark purple gradient inside tablet
    for y in range(ph):
        ratio = y / ph
        r = int(26 * (1 - ratio) + 60 * ratio)
        g = int(10 * (1 - ratio) + 10 * ratio)
        b = int(46 * (1 - ratio) + 80 * ratio)
        draw.line([(sx + 10, sy + y), (sx + pw - 10, sy + y)], fill=(r, g, b))

    # Re-clip
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=f['corner_r'], outline=None)

    # Decorative circles
    for cx, cy, cr in [(sx + int(pw * 0.15), sy + int(ph * 0.15), int(pw * 0.12)),
                        (sx + int(pw * 0.85), sy + int(ph * 0.35), int(pw * 0.09)),
                        (sx + int(pw * 0.25), sy + int(ph * 0.70), int(pw * 0.11)),
                        (sx + int(pw * 0.75), sy + int(ph * 0.80), int(pw * 0.08))]:
        draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(80, 30, 100), outline=None)

    # Center content vertically in frame
    content_center_y = sy + int(ph * 0.38)

    # FAME LIFE title
    title_text = "FAME LIFE"
    fame_font = fonts['fame_title']
    bbox = draw.textbbox((0, 0), title_text, font=fame_font)
    tw = bbox[2] - bbox[0]
    title_x = sx + (pw - tw) // 2
    title_y = content_center_y - int(ph * 0.08)
    # Glow
    for offset in range(6, 0, -1):
        draw.text((title_x - offset, title_y), title_text, fill=(150, 50, 200), font=fame_font)
    draw.text((title_x, title_y), title_text, fill=WHITE, font=fame_font)

    # Subtitle
    sub = "Influencer Simulator"
    bbox = draw.textbbox((0, 0), sub, font=fonts['body'])
    tw = bbox[2] - bbox[0]
    sub_y = title_y + int(ph * 0.07)
    draw.text((sx + (pw - tw) // 2, sub_y), sub, fill=(200, 180, 255), font=fonts['body'])

    # Decorative stars
    stars = "* * * * *"
    bbox = draw.textbbox((0, 0), stars, font=fonts['body'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, sub_y + int(ph * 0.045)), stars, fill=GOLD, font=fonts['body'])

    # Follower count display
    count_y = sub_y + int(ph * 0.11)
    box_w = int(pw * 0.5)
    box_h = int(ph * 0.06)
    draw.rounded_rectangle(
        [sx + (pw - box_w) // 2, count_y, sx + (pw + box_w) // 2, count_y + box_h],
        radius=22, fill=(40, 15, 70)
    )
    fc_text = "0 Followers"
    bbox = draw.textbbox((0, 0), fc_text, font=fonts['title'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, count_y + int(box_h * 0.2)), fc_text, fill=(200, 180, 255), font=fonts['title'])

    # Start button
    btn_w = int(pw * 0.45)
    btn_h = int(ph * 0.045)
    btn_x = sx + (pw - btn_w) // 2
    btn_y = count_y + box_h + int(ph * 0.06)
    draw_gradient_button(draw, btn_x, btn_y, btn_w, btn_h, "Start Your Fame Story", fonts['button'])

    # Bottom text
    btxt = "Choose your path to fame"
    bbox = draw.textbbox((0, 0), btxt, font=fonts['small'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, btn_y + btn_h + int(ph * 0.03)), btxt, fill=(150, 130, 180), font=fonts['small'])

    # Version
    draw.text((sx + (pw - 60) // 2, sy + ph - int(ph * 0.04)), "v1.0", fill=(100, 80, 130), font=fonts['tiny'])

    img.save(os.path.join(OUTPUT_DIR, f"{cfg['name']}-1.png"))
    print(f"  {cfg['name']}-1.png saved")


def create_screenshot_2(cfg, fonts):
    """Make Every Choice Count - Drama event card."""
    W, H = cfg["W"], cfg["H"]
    f = get_frame(cfg)

    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, W, H)
    draw_headline(draw, W, "Make Every Choice Count", "100+ story events shape your career", fonts, y_start=int(H * 0.03))
    draw_tablet_frame(draw, W, H, f['left'], f['top'], f['right'], f['bottom'], f['corner_r'])

    sx, sy, pw, ph = f['left'], f['top'], f['w'], f['h']
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=f['corner_r'], fill=DARK_BG)

    draw_stat_bar(draw, sx, sy, pw, fonts)

    # Quarter label
    draw.text((sx + 40, sy + 130), "Q2 Year 1", fill=(180, 160, 220), font=fonts['small_bold'])

    # Event card - fills most of the screen
    card_margin = int(pw * 0.03)
    card_x = sx + card_margin
    card_y = sy + int(ph * 0.09)
    card_w = pw - 2 * card_margin
    card_bottom = sy + ph - int(ph * 0.03)
    card_h = card_bottom - card_y

    # Dark card background (not white)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill=(35, 18, 58))

    # Inner content area with slight border
    inner_pad = int(card_w * 0.03)

    # Badge
    badge_w = int(card_w * 0.14)
    badge_h = int(ph * 0.025)
    draw.rounded_rectangle([card_x + inner_pad, card_y + inner_pad,
                            card_x + inner_pad + badge_w, card_y + inner_pad + badge_h],
                           radius=12, fill=(180, 50, 50))
    badge_text = "DRAMA"
    bbox = draw.textbbox((0, 0), badge_text, font=fonts['small_bold'])
    btw = bbox[2] - bbox[0]
    draw.text((card_x + inner_pad + (badge_w - btw) // 2, card_y + inner_pad + int(badge_h * 0.2)),
              badge_text, fill=WHITE, font=fonts['small_bold'])

    # Title
    title_y = card_y + inner_pad + badge_h + int(ph * 0.015)
    draw.text((card_x + inner_pad, title_y), "Hot Mic Moment", fill=WHITE, font=fonts['shop_title'])

    # Separator line
    sep_y = title_y + int(ph * 0.04)
    draw.line([(card_x + inner_pad, sep_y), (card_x + card_w - inner_pad, sep_y)], fill=(60, 35, 90), width=2)

    # Description
    desc_lines = [
        "During a live stream, your microphone picks up",
        "a private conversation where you're venting",
        "about another creator.",
        "",
        "The clip is already going viral.",
        "How do you respond?"
    ]
    dy = sep_y + int(ph * 0.02)
    line_h = int(ph * 0.025)
    for line in desc_lines:
        draw.text((card_x + inner_pad, dy), line, fill=(200, 185, 225), font=fonts['body'])
        dy += line_h

    # Impact preview box
    dy += int(ph * 0.015)
    imp_h = int(ph * 0.05)
    draw.rounded_rectangle([card_x + inner_pad, dy, card_x + card_w - inner_pad, dy + imp_h],
                           radius=14, fill=(50, 28, 80))
    draw.text((card_x + inner_pad + 20, dy + int(imp_h * 0.15)), "Impact:", fill=PURPLE, font=fonts['small_bold'])
    draw.text((card_x + inner_pad + 20, dy + int(imp_h * 0.55)), "High Risk / High Reward",
              fill=(170, 150, 200), font=fonts['small'])

    # Choice A
    choice_y = dy + imp_h + int(ph * 0.025)
    ch_h = int(ph * 0.10)
    draw.rounded_rectangle([card_x + inner_pad, choice_y, card_x + card_w - inner_pad, choice_y + ch_h],
                           radius=18, fill=(30, 60, 40))
    draw.rounded_rectangle([card_x + inner_pad, choice_y, card_x + card_w - inner_pad, choice_y + ch_h],
                           radius=18, outline=GREEN, width=3)
    row_h = ch_h // 4
    draw.text((card_x + inner_pad + 25, choice_y + row_h * 0), "A: Own It & Apologize",
              fill=GREEN, font=fonts['body_bold'])
    draw.text((card_x + inner_pad + 25, choice_y + row_h * 1), "Post a heartfelt apology video.",
              fill=(180, 210, 180), font=fonts['small'])
    draw.text((card_x + inner_pad + 25, choice_y + row_h * 2), "Followers +5%   Fame +3",
              fill=(100, 200, 120), font=fonts['small'])
    draw.text((card_x + inner_pad + 25, choice_y + row_h * 3), "-$500 (charity donation)",
              fill=(200, 130, 130), font=fonts['small'])

    # Choice B
    choice_y2 = choice_y + ch_h + int(ph * 0.02)
    draw.rounded_rectangle([card_x + inner_pad, choice_y2, card_x + card_w - inner_pad, choice_y2 + ch_h],
                           radius=18, fill=(60, 25, 30))
    draw.rounded_rectangle([card_x + inner_pad, choice_y2, card_x + card_w - inner_pad, choice_y2 + ch_h],
                           radius=18, outline=RED, width=3)
    draw.text((card_x + inner_pad + 25, choice_y2 + row_h * 0), "B: Double Down",
              fill=RED, font=fonts['body_bold'])
    draw.text((card_x + inner_pad + 25, choice_y2 + row_h * 1), "Lean into the drama for clout.",
              fill=(210, 180, 180), font=fonts['small'])
    draw.text((card_x + inner_pad + 25, choice_y2 + row_h * 2), "Followers +15%  Viral!",
              fill=(230, 100, 100), font=fonts['small'])
    draw.text((card_x + inner_pad + 25, choice_y2 + row_h * 3), "Fame -5   Reputation risk",
              fill=(200, 130, 130), font=fonts['small'])

    # Timer bar at bottom of card
    timer_y = card_y + card_h - int(ph * 0.04)
    bar_full_w = card_w - 2 * inner_pad
    draw.rounded_rectangle([card_x + inner_pad, timer_y, card_x + inner_pad + bar_full_w, timer_y + 8],
                           radius=4, fill=(50, 30, 75))
    draw.rounded_rectangle([card_x + inner_pad, timer_y, card_x + inner_pad + int(bar_full_w * 0.4), timer_y + 8],
                           radius=4, fill=PURPLE)
    draw.text((card_x + inner_pad, timer_y + 16), "Choose within this quarter",
              fill=(150, 140, 170), font=fonts['tiny'])

    img.save(os.path.join(OUTPUT_DIR, f"{cfg['name']}-2.png"))
    print(f"  {cfg['name']}-2.png saved")


def create_screenshot_3(cfg, fonts):
    """Grow Your Income - Quarterly income breakdown."""
    W, H = cfg["W"], cfg["H"]
    f = get_frame(cfg)

    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, W, H)
    draw_headline(draw, W, "Grow Your Income", "6 revenue streams to master", fonts, y_start=int(H * 0.03))
    draw_tablet_frame(draw, W, H, f['left'], f['top'], f['right'], f['bottom'], f['corner_r'])

    sx, sy, pw, ph = f['left'], f['top'], f['w'], f['h']
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=f['corner_r'], fill=DARK_BG)
    draw_stat_bar(draw, sx, sy, pw, fonts)

    # Quarter income header card
    header_y = sy + int(ph * 0.06)
    hdr_h = int(ph * 0.08)
    draw.rounded_rectangle([sx + 40, header_y, sx + pw - 40, header_y + hdr_h],
                           radius=22, fill=(40, 18, 70))
    draw.text((sx + 70, header_y + int(hdr_h * 0.12)), "Q3 Income Report", fill=WHITE, font=fonts['body_bold'])
    draw.text((sx + 70, header_y + int(hdr_h * 0.48)), "$12,847", fill=GREEN, font=fonts['income_big'])
    draw.text((sx + int(pw * 0.35), header_y + int(hdr_h * 0.58)), "+34% vs last quarter",
              fill=(130, 220, 130), font=fonts['small'])

    # Income streams -- distribute evenly in remaining space
    streams = [
        ("Ad Revenue", "$4,200", "+12%", (59, 130, 246), 0.70),
        ("Sponsorships", "$3,500", "+45%", (147, 51, 234), 0.58),
        ("Donations", "$2,100", "+28%", (236, 73, 153), 0.35),
        ("Subscriptions", "$1,800", "+52%", (249, 115, 22), 0.30),
        ("Merch Sales", "$847", "NEW!", (34, 197, 94), 0.14),
        ("Brand Deals", "$400", "+5%", (234, 179, 8), 0.07),
    ]

    emojis = ["AD", "SP", "DN", "SB", "MR", "BD"]

    cards_top = header_y + hdr_h + int(ph * 0.015)
    cards_bottom = sy + ph - int(ph * 0.06)  # leave room for summary
    total_cards_h = cards_bottom - cards_top
    card_spacing = total_cards_h // 6
    card_h = card_spacing - 14

    for i, (name, amount, change, color, bar_pct) in enumerate(streams):
        cy = cards_top + i * card_spacing

        # Card
        draw.rounded_rectangle([sx + 40, cy, sx + pw - 40, cy + card_h], radius=18, fill=CARD_BG)

        # Color dot
        dot_size = int(card_h * 0.38)
        circle_x = sx + 70
        circle_y = cy + int(card_h * 0.15)
        draw.ellipse([circle_x, circle_y, circle_x + dot_size, circle_y + dot_size], fill=color)
        # Label in circle
        lbl = emojis[i]
        lbl_font = load_font(int(dot_size * 0.35), bold=True)
        bbox = draw.textbbox((0, 0), lbl, font=lbl_font)
        lw = bbox[2] - bbox[0]
        draw.text((circle_x + (dot_size - lw) // 2, circle_y + int(dot_size * 0.28)),
                  lbl, fill=WHITE, font=lbl_font)

        text_left = sx + 80 + dot_size + 15

        # Name and amount
        draw.text((text_left, cy + int(card_h * 0.10)), name, fill=DARK_BG, font=fonts['body_bold'])

        # Amount right-aligned
        bbox = draw.textbbox((0, 0), amount, font=fonts['body_bold'])
        tw = bbox[2] - bbox[0]
        draw.text((sx + pw - 80 - tw, cy + int(card_h * 0.10)), amount, fill=DARK_BG, font=fonts['body_bold'])

        # Change badge
        change_color = GREEN if "+" in change or "NEW" in change else RED
        draw.text((text_left, cy + int(card_h * 0.42)), change, fill=change_color, font=fonts['small_bold'])

        # Progress bar
        bar_x = text_left
        bar_y_pos = cy + int(card_h * 0.72)
        bar_w = pw - (text_left - sx) - 80
        bar_h = int(card_h * 0.12)
        draw.rounded_rectangle([bar_x, bar_y_pos, bar_x + bar_w, bar_y_pos + bar_h],
                               radius=bar_h // 2, fill=(235, 230, 245))
        draw.rounded_rectangle([bar_x, bar_y_pos, bar_x + int(bar_w * bar_pct), bar_y_pos + bar_h],
                               radius=bar_h // 2, fill=color)

        pct_text = f"{int(bar_pct * 100)}%"
        draw.text((bar_x + bar_w + 12, bar_y_pos - 4), pct_text, fill=(140, 130, 160), font=fonts['tiny'])

    # Bottom summary
    sum_y = sy + ph - int(ph * 0.045)
    draw.rounded_rectangle([sx + 40, sum_y, sx + pw - 40, sum_y + int(ph * 0.035)],
                           radius=16, fill=(40, 18, 70))
    draw.text((sx + 70, sum_y + int(ph * 0.008)), "Passive Income Rate: $1,425/quarter",
              fill=(200, 190, 230), font=fonts['small_bold'])

    img.save(os.path.join(OUTPUT_DIR, f"{cfg['name']}-3.png"))
    print(f"  {cfg['name']}-3.png saved")


def create_screenshot_4(cfg, fonts):
    """Upgrade & Expand - Shop screen."""
    W, H = cfg["W"], cfg["H"]
    f = get_frame(cfg)

    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, W, H)
    draw_headline(draw, W, "Upgrade & Expand", "Shop for gear, staff & studios", fonts, y_start=int(H * 0.03))
    draw_tablet_frame(draw, W, H, f['left'], f['top'], f['right'], f['bottom'], f['corner_r'])

    sx, sy, pw, ph = f['left'], f['top'], f['w'], f['h']
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=f['corner_r'], fill=DARK_BG)
    draw_stat_bar(draw, sx, sy, pw, fonts)

    # Shop header
    header_y = sy + int(ph * 0.06)
    draw.text((sx + 40, header_y), "Creator Shop", fill=WHITE, font=fonts['title'])

    # Balance pill
    bal_w = int(pw * 0.18)
    bal_h = int(ph * 0.032)
    draw.rounded_rectangle([sx + pw - bal_w - 40, header_y, sx + pw - 40, header_y + bal_h],
                           radius=14, fill=(40, 18, 70))
    bal_text = "$4,600"
    bbox = draw.textbbox((0, 0), bal_text, font=fonts['body_bold'])
    btw = bbox[2] - bbox[0]
    draw.text((sx + pw - 40 - bal_w // 2 - btw // 2, header_y + int(bal_h * 0.15)),
              bal_text, fill=GREEN, font=fonts['body_bold'])

    # Tab bar
    tab_y = header_y + bal_h + int(ph * 0.015)
    tab_h = int(ph * 0.03)
    tabs = ["Gear", "Staff", "Studio", "Perks"]
    tab_w = (pw - 100) // 4
    for i, tab in enumerate(tabs):
        tx = sx + 50 + i * tab_w
        is_active = i == 0
        fill = PURPLE if is_active else (40, 18, 70)
        draw.rounded_rectangle([tx, tab_y, tx + tab_w - 12, tab_y + tab_h], radius=12, fill=fill)
        bbox = draw.textbbox((0, 0), tab, font=fonts['small_bold'])
        tw = bbox[2] - bbox[0]
        draw.text((tx + (tab_w - 12 - tw) // 2, tab_y + int(tab_h * 0.2)), tab, fill=WHITE, font=fonts['small_bold'])

    # Shop items -- fill the remaining space
    items = [
        ("Ring Light", "$200", "Boost stream quality", "+5% donations", True, GREEN, True),
        ("Better Phone", "$500", "Unlock vertical video", "+10% ad revenue", True, BLUE, False),
        ("Pro Camera", "$2,000", "Professional content", "+20% sponsorships", True, PURPLE, False),
        ("Studio Mic", "$800", "Crystal clear audio", "+8% subscribers", True, ORANGE, False),
        ("Editing Suite", "$3,500", "Advanced post-production", "+15% all income", False, PINK, False),
    ]

    items_top = tab_y + tab_h + int(ph * 0.015)
    items_bottom = sy + ph - int(ph * 0.02)
    total_items_h = items_bottom - items_top
    item_spacing = total_items_h // 5
    item_h = item_spacing - 14

    for i, (name, price, desc, bonus, affordable, accent, owned) in enumerate(items):
        iy = items_top + i * item_spacing

        card_fill = CARD_BG if affordable else (240, 238, 245)
        draw.rounded_rectangle([sx + 40, iy, sx + pw - 40, iy + item_h], radius=18, fill=card_fill)

        # Left accent bar
        draw.rounded_rectangle([sx + 40, iy + 6, sx + 50, iy + item_h - 6], radius=0, fill=accent)

        # Color dot
        dot_size = int(item_h * 0.35)
        dot_x = sx + 70
        dot_y = iy + int(item_h * 0.18)
        draw.ellipse([dot_x, dot_y, dot_x + dot_size, dot_y + dot_size], fill=accent)

        text_left = dot_x + dot_size + 20

        # Name
        name_color = DARK_BG if affordable else (150, 145, 160)
        draw.text((text_left, iy + int(item_h * 0.10)), name, fill=name_color, font=fonts['body_bold'])

        # Description
        draw.text((text_left, iy + int(item_h * 0.38)), desc, fill=(120, 115, 135), font=fonts['small'])

        # Bonus
        draw.text((text_left, iy + int(item_h * 0.62)), bonus,
                  fill=GREEN if affordable else (150, 200, 150), font=fonts['small_bold'])

        # Price / Buy button or Owned tag
        if owned:
            tag_w = int(pw * 0.10)
            tag_h = int(item_h * 0.28)
            tag_x = sx + pw - 80 - tag_w
            tag_y_pos = iy + int(item_h * 0.20)
            draw.rounded_rectangle([tag_x, tag_y_pos, tag_x + tag_w, tag_y_pos + tag_h],
                                   radius=10, fill=(220, 252, 231))
            ot = "Owned"
            bbox = draw.textbbox((0, 0), ot, font=fonts['small_bold'])
            otw = bbox[2] - bbox[0]
            draw.text((tag_x + (tag_w - otw) // 2, tag_y_pos + int(tag_h * 0.15)),
                      ot, fill=(22, 101, 52), font=fonts['small_bold'])
        elif affordable:
            btn_w_px = int(pw * 0.13)
            btn_h_px = int(item_h * 0.32)
            btn_x = sx + pw - 80 - btn_w_px
            btn_y_pos = iy + int(item_h * 0.18)
            draw_gradient_button(draw, btn_x, btn_y_pos, btn_w_px, btn_h_px, price, fonts['small_bold'])
        else:
            # Locked
            bbox = draw.textbbox((0, 0), price, font=fonts['body_bold'])
            tw = bbox[2] - bbox[0]
            draw.text((sx + pw - 80 - tw, iy + int(item_h * 0.15)), price,
                      fill=(180, 170, 195), font=fonts['body_bold'])
            draw.text((sx + pw - 130, iy + int(item_h * 0.48)), "Locked",
                      fill=(160, 150, 180), font=fonts['small'])

    img.save(os.path.join(OUTPUT_DIR, f"{cfg['name']}-4.png"))
    print(f"  {cfg['name']}-4.png saved")


def create_screenshot_5(cfg, fonts):
    """Earn Your Legacy - Achievement popup."""
    W, H = cfg["W"], cfg["H"]
    f = get_frame(cfg)

    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    create_gradient_bg(draw, W, H)
    draw_headline(draw, W, "Earn Your Legacy", "31 achievements to unlock", fonts, y_start=int(H * 0.03))
    draw_tablet_frame(draw, W, H, f['left'], f['top'], f['right'], f['bottom'], f['corner_r'])

    sx, sy, pw, ph = f['left'], f['top'], f['w'], f['h']
    draw.rounded_rectangle([sx, sy, sx + pw, sy + ph], radius=f['corner_r'], fill=DARK_BG)
    draw_stat_bar(draw, sx, sy, pw, fonts)

    # Achievement popup overlay -- takes up about 45% of screen height
    overlay_y = sy + int(ph * 0.07)
    overlay_h = int(ph * 0.48)
    overlay_pad = int(pw * 0.03)
    draw.rounded_rectangle([sx + overlay_pad, overlay_y, sx + pw - overlay_pad, overlay_y + overlay_h],
                           radius=30, fill=(15, 8, 30))

    # Golden border inner
    inner_pad = int(pw * 0.02)
    ix1 = sx + overlay_pad + inner_pad
    iy1 = overlay_y + inner_pad
    ix2 = sx + pw - overlay_pad - inner_pad
    iy2 = overlay_y + overlay_h - inner_pad
    draw.rounded_rectangle([ix1, iy1, ix2, iy2], radius=24, outline=GOLD, width=3)
    draw.rounded_rectangle([ix1, iy1, ix2, iy2], radius=24, fill=(30, 18, 50))

    inner_h = iy2 - iy1

    # Header text
    header_text = "ACHIEVEMENT UNLOCKED!"
    bbox = draw.textbbox((0, 0), header_text, font=fonts['body_bold'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, iy1 + int(inner_h * 0.04)), header_text, fill=GOLD, font=fonts['body_bold'])

    # Badge circle
    badge_cx = sx + pw // 2
    badge_cy = iy1 + int(inner_h * 0.33)
    badge_r = int(inner_h * 0.16)
    draw.ellipse([badge_cx - badge_r - 8, badge_cy - badge_r - 8,
                  badge_cx + badge_r + 8, badge_cy + badge_r + 8], fill=GOLD)
    draw.ellipse([badge_cx - badge_r, badge_cy - badge_r,
                  badge_cx + badge_r, badge_cy + badge_r], fill=(50, 25, 80))
    # 10K text
    icon_text = "10K"
    bbox = draw.textbbox((0, 0), icon_text, font=fonts['fame_big'])
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((badge_cx - tw // 2, badge_cy - th // 2 - int(badge_r * 0.18)),
              icon_text, fill=GOLD, font=fonts['fame_big'])
    club_text = "CLUB"
    bbox = draw.textbbox((0, 0), club_text, font=fonts['small_bold'])
    tw = bbox[2] - bbox[0]
    draw.text((badge_cx - tw // 2, badge_cy + int(badge_r * 0.35)),
              club_text, fill=(200, 180, 255), font=fonts['small_bold'])

    # Achievement name
    name_text = "10K Club"
    bbox = draw.textbbox((0, 0), name_text, font=fonts['achievement'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, iy1 + int(inner_h * 0.58)), name_text, fill=WHITE, font=fonts['achievement'])

    # Description
    desc_text = "Reach 10,000 followers"
    bbox = draw.textbbox((0, 0), desc_text, font=fonts['body'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, iy1 + int(inner_h * 0.68)), desc_text, fill=(180, 170, 210), font=fonts['body'])

    # Reward box
    reward_y = iy1 + int(inner_h * 0.76)
    rw = int(pw * 0.35)
    rh = int(inner_h * 0.07)
    draw.rounded_rectangle([sx + (pw - rw) // 2, reward_y, sx + (pw + rw) // 2, reward_y + rh],
                           radius=14, fill=(40, 25, 65))
    reward_text = "Reward: Gold Profile Badge"
    bbox = draw.textbbox((0, 0), reward_text, font=fonts['small_bold'])
    tw = bbox[2] - bbox[0]
    draw.text((sx + (pw - tw) // 2, reward_y + int(rh * 0.2)), reward_text, fill=GOLD, font=fonts['small_bold'])

    # Claim button
    btn_w = int(pw * 0.3)
    btn_h = int(inner_h * 0.07)
    btn_x = sx + (pw - btn_w) // 2
    draw_gradient_button(draw, btn_x, iy1 + int(inner_h * 0.87), btn_w, btn_h,
                         "Claim Reward", fonts['button'])

    # Achievement grid below overlay -- 3x4 grid filling remaining space
    achievements = [
        ("First Post", True), ("100 Fans", True), ("Viral Hit", True),
        ("10K Club", True), ("Brand Deal", True), ("Full-Time", True),
        ("100K Club", False), ("Trendsetter", False), ("Collab King", False),
        ("Millionaire", False), ("Mega Star", False), ("Legend", False),
    ]

    grid_top = overlay_y + overlay_h + int(ph * 0.02)
    grid_bottom = sy + ph - int(ph * 0.06)  # leave room for progress bar
    grid_h = grid_bottom - grid_top

    cols = 3
    rows = 4
    gap = 14
    cell_w = (pw - 2 * overlay_pad - (cols - 1) * gap) // cols
    cell_h = (grid_h - (rows - 1) * gap) // rows

    for i, (name, unlocked) in enumerate(achievements):
        col = i % cols
        row = i // cols
        if row >= rows:
            break
        cx = sx + overlay_pad + col * (cell_w + gap)
        cy = grid_top + row * (cell_h + gap)

        fill = (50, 30, 75) if unlocked else (25, 15, 40)
        draw.rounded_rectangle([cx, cy, cx + cell_w, cy + cell_h], radius=14, fill=fill)

        # Name centered
        bbox = draw.textbbox((0, 0), name, font=fonts['tiny'])
        nw = bbox[2] - bbox[0]
        text_color = WHITE if unlocked else (80, 65, 100)
        draw.text((cx + (cell_w - nw) // 2, cy + int(cell_h * 0.25)), name, fill=text_color, font=fonts['tiny'])

        # Status
        if unlocked:
            st = "Unlocked"
            st_color = GREEN
        else:
            st = "Locked"
            st_color = (80, 65, 100)
        bbox = draw.textbbox((0, 0), st, font=fonts['tiny'])
        stw = bbox[2] - bbox[0]
        draw.text((cx + (cell_w - stw) // 2, cy + int(cell_h * 0.60)), st, fill=st_color, font=fonts['tiny'])

    # Progress bar at bottom
    prog_y = sy + ph - int(ph * 0.04)
    prog_h = int(ph * 0.028)
    draw.rounded_rectangle([sx + overlay_pad, prog_y, sx + pw - overlay_pad, prog_y + prog_h],
                           radius=14, fill=(30, 15, 50))
    draw.text((sx + overlay_pad + 20, prog_y + int(prog_h * 0.15)), "Progress: 6/31",
              fill=(180, 170, 210), font=fonts['small_bold'])

    bar_x = sx + int(pw * 0.22)
    bar_w = pw - int(pw * 0.27)
    bar_h_inner = int(prog_h * 0.4)
    bar_y_inner = prog_y + int(prog_h * 0.3)
    draw.rounded_rectangle([bar_x, bar_y_inner, bar_x + bar_w, bar_y_inner + bar_h_inner],
                           radius=bar_h_inner // 2, fill=(50, 30, 75))
    draw.rounded_rectangle([bar_x, bar_y_inner, bar_x + int(bar_w * 6 / 31), bar_y_inner + bar_h_inner],
                           radius=bar_h_inner // 2, fill=GOLD)

    img.save(os.path.join(OUTPUT_DIR, f"{cfg['name']}-5.png"))
    print(f"  {cfg['name']}-5.png saved")


if __name__ == "__main__":
    for cfg in CONFIGS:
        print(f"\nGenerating {cfg['name']} screenshots ({cfg['W']}x{cfg['H']})...")
        fonts = make_fonts(cfg['W'] / 2048)  # scale fonts relative to 13" width
        create_screenshot_1(cfg, fonts)
        create_screenshot_2(cfg, fonts)
        create_screenshot_3(cfg, fonts)
        create_screenshot_4(cfg, fonts)
        create_screenshot_5(cfg, fonts)

    print(f"\nAll 10 iPad screenshots saved to {OUTPUT_DIR}")
