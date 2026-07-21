# 绾㈡ゼ姊︿汉鐗╃淮鍩?路 閮ㄧ讲璇存槑

## 鍖呭唴瀹?
| 鏂囦欢 | 澶у皬 | 璇存槑 |
|------|------|------|
| hlm-wiki.zip | 60.14 MB | 瀹屾暣婧愮爜锛堜笉鍚?node_modules / out锛?|
| hlm-wiki.bundle | 30.03 MB | Git bundle锛堝寘鍚?4 涓?commit锛?|
| deploy-export/ | 婧愭枃浠?| 鍖呭惈瀹屾暣婧愮爜 |

## 鏂瑰紡 1锛歏ercel CLI锛堟帹鑽愶級

### 姝ラ 1锛氳В鍘嬪苟杩涘叆鐩綍
\\\powershell
Expand-Archive hlm-wiki.zip -DestinationPath hlm-wiki-deploy
cd hlm-wiki-deploy
\\\

### 姝ラ 2锛氱櫥褰?Vercel
\\\powershell
vercel login
# 鍦ㄦ祻瑙堝櫒涓畬鎴愭巿鏉?\\\

### 姝ラ 3锛氶儴缃?\\\powershell
cd site
npm install
npm run build
cd ..
vercel --prod
# 鎺ュ彈榛樿閰嶇疆锛孷ercel 浼氳鍙?vercel.json
\\\

## 鏂瑰紡 2锛欸itHub + Vercel 鑷姩閮ㄧ讲

### 姝ラ 1锛氬垱寤?GitHub 浠撳簱
1. 璁块棶 https://github.com/new
2. 浠撳簱鍚? hlm-wiki
3. 璁剧疆涓?Public 鎴?Private
4. **涓嶈**鍒濆鍖?README

### 姝ラ 2锛氭帹閫佷唬鐮?\\\ash
# 鏂瑰紡 A锛氫娇鐢?GitHub Token
git remote add origin https://<TOKEN>@github.com/<鐢ㄦ埛鍚?/hlm-wiki.git
git push -u origin main

# 鏂瑰紡 B锛氫娇鐢?SSH
git remote add origin git@github.com:<鐢ㄦ埛鍚?/hlm-wiki.git
git push -u origin main
\\\

### 姝ラ 3锛氬湪 Vercel 鍚庡彴杩炴帴
1. 璁块棶 https://vercel.com/new
2. 閫夋嫨 "Import Git Repository"
3. 閫夋嫨 hlm-wiki 浠撳簱
4. Vercel 鑷姩璇嗗埆 vercel.json 閰嶇疆
5. 鐐瑰嚮 "Deploy"

## 鏂瑰紡 3锛氭墜鍔ㄤ笂浼?site/out

1. 鍦ㄦ湰鍦版瀯寤猴細\cd site && npm install && npm run build\
2. 璁块棶 https://vercel.com/new
3. 鎷栨嫿 \site/out\ 鐩綍鍒颁笂浼犲尯鍩?4. 鐐瑰嚮 "Deploy"

## 楠岃瘉閮ㄧ讲

閮ㄧ讲鎴愬姛鍚庯紝璁块棶杩斿洖鐨?URL锛屽簲鑳界湅鍒帮細
- 棣栭〉锛歕https://<浣犵殑鍩熷悕>/zh/\ 鎴?\/en/\
- 浜虹墿鍒楄〃锛歕/zh/character/\
- 瑙掕壊璇︽儏锛歕/zh/character/jia-family/jia-baoyu/\

## 甯歌闂

### 閮ㄧ讲澶辫触
- 妫€鏌?\ercel.json\ 涓殑 buildCommand: \cd site && npm install && npm run build\
- 妫€鏌?\site/out\ 鏄惁鐢熸垚锛圽
pm run build\ 鍚庯級

### 404 閿欒
- 闈欐€佸鍑轰娇鐢?\	railingSlash: true\
- URL 蹇呴』浠?\/\ 缁撳熬锛堝 \/zh/\ 鑰屼笉鏄?\/zh\锛?
### 鍥剧墖涓嶆樉绀?- 妫€鏌?\site/lib/data.ts\ 涓殑 \getPortraitUrl\ 璺緞
- \ssets/portraits/\ 鐩綍闇€瑕佸寘鍚湪閮ㄧ讲涓?
## 椤圭洰鍏冧俊鎭?
- **鎬绘枃浠?*: 800+
- **闈欐€侀〉闈?*: 414 (zh + en 脳 204 瑙掕壊 + 6 鍏叡)
- **浜虹墿鍍?*: 113 寮?- **Git 鎻愪氦**: 4 涓?- **鏋勫缓鍛戒护**: \cd site && npm install && npm run build\
- **杈撳嚭鐩綍**: \site/out\

鏈€鍚庢洿鏂? 2026-07-20
