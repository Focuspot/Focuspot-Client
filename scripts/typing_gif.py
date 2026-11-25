# 캐릭터 PNG → 타자 치는 GIF 생성기
# 사용법: pip install pillow numpy && python3 scripts/typing_gif.py src/renderer/src/assets/characters src/renderer/src/assets/characters
"""기존 캐릭터 PNG의 팔(어깨→앞발)을 국소 변형해 '타자 치는' GIF를 만든다.

팔마다 어깨(S)와 앞발(P) 두 점을 잡고, 앞발 쪽일수록 크게 / 어깨 쪽일수록 작게
위아래로 움직여 어깨를 축으로 팔을 들었다 내리는 것처럼 보이게 한다.
노트북 화면 영역은 보호 마스크로 움직이지 않게 막는다.
"""

import sys
import math
import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# arms: (어깨 x, y, 앞발 x, y, 팔 두께 반경)
# screen: 노트북 화면 왼쪽 모서리 선 (x1, y1, x2, y2) — 이 선 오른쪽은 고정
# deck: 키보드 판 뒤쪽 모서리 선 (x1, y1, x2, y2) — 이 선 아래는 고정
# drop: 공중에 떠 있는 첫 번째 팔을 키보드까지 내리는 거리(px). None이면 위로 톡톡만
# lean: drop 중 상체(머리 포함)가 함께 숙여지는 거리 — 얼굴이 일그러지지 않게 한다
CONF = {
    'cat': dict(
        crop=(0, 0, 1024),
        arms=[(170, 640, 370, 655, 60), (455, 560, 515, 735, 48)],
        screen=(628, 505, 528, 905),
        deck=(200, 812, 560, 762),
        head=(470, 400, 170, 150),
        amp=62,
        drop=100,
        lean=48,
    ),
    'dog': dict(
        crop=(0, 0, 1024),
        arms=[(170, 640, 355, 675, 60), (470, 580, 525, 745, 48)],
        screen=(625, 505, 528, 905),
        deck=(200, 815, 560, 765),
        head=(470, 410, 170, 150),
        amp=62,
        drop=92,
        lean=44,
    ),
    'hamster': dict(
        crop=(256, 0, 1024),
        arms=[(690, 770, 745, 885, 42), (885, 760, 860, 865, 38)],
        screen=(905, 690, 868, 1024),
        deck=(590, 905, 880, 890),
        head=(820, 560, 230, 170),
        amp=44,
        drop=None,
        lean=0,
    ),
}
N = 24  # 프레임 수
FRAME_MS = 40  # 프레임 간격(ms) — 20 미만은 브라우저가 100ms로 느리게 재생
OUT_SIZE = 320
HEAD_AMP = 5


def tap(t: float) -> float:
    """한 주기(0~1) 중 앞 절반 동안 들었다 내리는 곡선 (0..1)."""
    t %= 1.0
    if t < 0.55:
        return math.sin(math.pi * t / 0.55) ** 2
    return 0.0


def smoothstep(x: np.ndarray) -> np.ndarray:
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def ease(x: float) -> float:
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def drop_curve(t: float) -> float:
    """내려가서(0~0.3) 키보드에 닿아 잠깐 멈췄다가(~0.45) 다시 올라감(~0.75)."""
    t %= 1.0
    if t < 0.3:
        return ease(t / 0.3)
    if t < 0.45:
        return 1.0
    if t < 0.75:
        return 1.0 - ease((t - 0.45) / 0.3)
    return 0.0


def window_tap(t: float, start: float, end: float) -> float:
    """start~end 구간에서 한 번 들었다 내리는 곡선."""
    t %= 1.0
    if start <= t < end:
        return math.sin(math.pi * (t - start) / (end - start)) ** 2
    return 0.0


def render(name: str, cfg: dict) -> None:
    src = np.asarray(Image.open(f'{SRC}/{name}.png').convert('RGB')).astype(np.float32)
    h, w, _ = src.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    amp = cfg['amp']
    feather = amp * 1.6  # 이보다 좁으면 픽셀이 접히며 깨짐

    # 노트북 화면 보호 마스크 (선 왼쪽 = 1, 오른쪽 = 0)
    x1, y1, x2, y2 = cfg['screen']
    line_x = x1 + (yy - y1) * (x2 - x1) / (y2 - y1)
    protect = smoothstep((line_x - xx) / 30.0)

    # 키보드 판 보호: 선 위쪽으로 갈수록 서서히 움직임 허용
    # (선 바로 위에서는 앞발 아래쪽이 늘어나며 들리는 효과)
    dx1, dy1, dx2, dy2 = cfg['deck']
    deck_y = dy1 + (xx - dx1) * (dy2 - dy1) / (dx2 - dx1)
    screen_protect = protect
    protect = protect * smoothstep((deck_y - yy) / feather)
    drop = cfg['drop']

    def arm_field(arm, feather_up, feather_down, mask, reach_down=0.0):
        sx, sy, px, py, r = arm
        vx, vy = px - sx, py - sy
        length2 = vx * vx + vy * vy
        t = np.clip(((xx - sx) * vx + (yy - sy) * vy) / length2, 0.0, 1.0)
        cy = sy + t * vy
        dist = np.hypot(xx - (sx + t * vx), yy - cy)
        # 팔 위쪽은 넓게(늘어남), 아래쪽은 좁게(눌림) 감쇠
        # 팔 중심선 위/아래를 40px에 걸쳐 부드럽게 전환 (경계에서 접힘 방지)
        k = smoothstep((yy - cy) / 40.0 + 0.5)
        f = feather_up + (feather_down - feather_up) * k
        # reach_down: 팔이 내려앉을 자리까지 영역을 넓혀야 앞발이 눌리지 않음
        r_eff = r + reach_down * k
        body = 1.0 - smoothstep((dist - r_eff) / f)
        lever = smoothstep(t * 1.15)  # 어깨 0 → 앞발 1
        return body * lever * mask

    lean = cfg['lean']
    if drop:
        # 화면 보호는 노트북 화면 높이(그 위는 배경)에서만
        x1, y1, _, _ = cfg['screen']
        screen_only = 1 - (1 - screen_protect) * smoothstep((yy - (y1 - 25)) / 30.0)
        # 상체 숙이기: 배경(위쪽)에서 서서히 시작, 키보드 판 위에서 멈춤
        lean_field = screen_only * smoothstep((deck_y - yy) / feather) * smoothstep((yy - 60) / 140.0)
        arm_extra = drop - lean
        # 팔은 키보드를 덮어야 하므로 키보드 보호 없이, 아래쪽은 눌리게
        arm_fields = [
            arm_field(cfg['arms'][0], arm_extra * 1.6, 28.0, screen_only, reach_down=drop),
            arm_field(cfg['arms'][1], feather, feather, protect),
        ]
    else:
        arm_fields = [arm_field(a, feather, feather, protect) for a in cfg['arms']]

    hx, hy, hsx, hsy = cfg['head']
    head_field = np.exp(-(((xx - hx) / hsx) ** 2 + ((yy - hy) / hsy) ** 2) / 2)

    frames = []
    worst = 1.0
    for i in range(N):
        t = i / N
        if drop:
            # 떠 있던 팔: 내려와 키보드에 닿고 다시 올라감 / 다른 팔: 그 사이 톡톡
            c = drop_curve(t)
            body_lean = lean * lean_field
            # 팔 영역은 상체 숙임과 상관없이 항상 drop만큼 내려가도록 보간
            dy = -c * (body_lean + (drop - body_lean) * arm_fields[0])
            dy = dy + amp * window_tap(t, 0.5, 0.95) * arm_fields[1]
        else:
            # 두 팔 번갈아 (한 루프에 각 2번)
            dy = amp * (tap(2 * t) * arm_fields[0] + tap(2 * t + 0.5) * arm_fields[1])
        if not drop:
            dy = dy + HEAD_AMP * math.sin(2 * math.pi * t * 2) * head_field
        worst = min(worst, float((1 + np.diff(dy, axis=0)).min()))
        sy = np.clip(yy + dy, 0, h - 1)
        y0 = np.floor(sy).astype(np.int32)
        y1i = np.minimum(y0 + 1, h - 1)
        fy = (sy - y0)[..., None]
        xi = xx.astype(np.int32)
        out = src[y0, xi] * (1 - fy) + src[y1i, xi] * fy
        img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
        cx0, cy0, size = cfg['crop']
        img = img.crop((cx0, cy0, cx0 + size, cy0 + size)).resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
        frames.append(img)
    print(f'{name}: min vertical stretch {worst:.2f} (0 이하면 접힘)')

    # 전 프레임 공통 팔레트 → 깜빡임/밴딩 줄이기
    strip = Image.new('RGB', (OUT_SIZE, OUT_SIZE * N))
    for i, f in enumerate(frames):
        strip.paste(f, (0, OUT_SIZE * i))
    pal = strip.quantize(colors=255, method=Image.Quantize.FASTOCTREE)
    q = [f.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG) for f in frames]
    q[0].save(
        f'{OUT}/{name}.gif',
        save_all=True,
        append_images=q[1:],
        duration=FRAME_MS,
        loop=0,
        optimize=False,
        disposal=1,
    )


for n, c in CONF.items():
    render(n, c)
