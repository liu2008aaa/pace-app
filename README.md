# Pace.

> 一支只做一件事的跑步仪表盘。  
> 静默奔跑 · 智慧恢复

[![Expo](https://img.shields.io/badge/Expo-SDK%2051-000.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61dafb.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6.svg)](https://www.typescriptlang.org/)

---

## 你需要的全部测试步骤（Windows）

整个流程 **不需要任何 Mac**。第一次跑通约 30 分钟，之后每次启动 5 秒。

### 一、一次性环境准备（约 15 分钟）

#### 1. 在 Windows 上装 Node.js

去 https://nodejs.org/ 下载 **LTS 版本**（左边那个，目前是 v20.x），双击安装，全程下一步。装完后打开 **PowerShell** 验证：

```powershell
node --version    # 应该显示 v20.x.x
npm --version     # 应该显示 10.x.x
```

如果命令找不到，重启电脑或重开一个 PowerShell 窗口。

#### 2. 在 iPhone 上装 Expo Go

App Store 搜索 **Expo Go**，下载安装（免费，约 80 MB）。这是 Expo 官方的"宿主"应用，让你不用打包就能跑开发版。

#### 3. 确保手机和电脑在同一 Wi-Fi

> 这是最常见的卡点。如果你电脑插网线、手机走 5G，会连不上。  
> **必须同一 Wi-Fi。** 如果家里有路由器多频段，5GHz 和 2.4GHz 网段可能互不可见，建议都连 5GHz 段。

### 二、跑起这个项目（每次 5 秒）

打开 **PowerShell**，进入项目文件夹：

```powershell
cd D:\web3\pace-app
```

#### 第一次 —— 安装依赖（约 3-5 分钟）

```powershell
npm install
```

这一步会下载 React Native + Expo + 一堆库，慢慢等。完成后 `node_modules/` 文件夹会出现，约 500 MB。

> 如果 `npm install` 卡住或报错（国内网络常见），换成淘宝镜像：  
> `npm config set registry https://registry.npmmirror.com`  
> 然后重新 `npm install`

#### 启动开发服务器

```powershell
npx expo start
```

终端会出现一个**大大的二维码** + 一些日志，类似：

```
› Metro waiting on exp://192.168.1.123:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

#### 用 iPhone 扫码

- **iPhone**：直接打开**相机** APP 对准二维码 → 弹出"在 Expo Go 中打开" → 点开
- 或者打开 **Expo Go** APP → 按右上角扫码图标 → 对准二维码

第一次加载会显示一个进度条（约 30-60 秒下载 JS bundle），之后就秒开。

#### 看到 Pace. 首页

应该看到 **黑底冷绿配色**的待机首页，包含：
- 上午好，刘宇 + 上海 · 晴 · 18°C
- 三个发光环：状态 82 / 负荷 14.2 / 睡眠 87%
- ✦ AI 一句话建议
- 「出发 LET'S GO」大胶囊按钮
- 14 天活力时间线

#### 修改代码 → 实时预览

保留 PowerShell 不要关。在 **VS Code** 里打开 `D:\web3\pace-app` 文件夹，编辑任何 `.tsx` 文件，**保存的瞬间手机就会刷新**（hot reload）—— 你会看到改动立刻生效。

> 如果某次改动后界面卡住，在 PowerShell 里按 `r` 强制刷新。

---

## 常见卡点排查

### "二维码扫了没反应 / 一直转圈"

**症状**：扫码后 Expo Go 一直 connecting，或加载失败。  
**原因**：电脑和手机不在同一 Wi-Fi 子网，或 Windows 防火墙挡了 8081 端口。  

**解决**（三种方案，由易到难）：

1. 切到 **tunnel 模式**（绕过 Wi-Fi，走 Expo 的服务器中转）：
   ```powershell
   npx expo start --tunnel
   ```
   慢一点（首次启动需要 30 秒），但几乎一定能通。

2. 允许 Windows 防火墙：第一次运行 `npx expo start` 时如果弹窗"允许 Node.js 通过防火墙"，**两个网络（专用/公用）都勾上**。

3. 关掉 VPN（如果开着的话），或在 VPN 设置里允许局域网。

### "找不到 npx 命令"

Node.js 没装好，重新去 nodejs.org 装一遍 LTS。或者直接关闭 PowerShell 重开。

### "react-native-reanimated babel plugin 报错"

确保 `babel.config.js` 里 `'react-native-reanimated/plugin'` **是 plugins 数组的最后一项**。然后清缓存重启：
```powershell
npx expo start -c
```

### "项目跑起来了但字体变成系统默认字体"

这是因为 Pace. 用的 **JetBrains Mono** 和 **Noto Sans SC** 字体还没下载到 iPhone。Expo 会在首次启动时通过网络下载（约 5-15 秒），耐心等。如果一直下不下来，看终端是不是有 font 加载失败的报错。

### "我电脑没装过 git"

不影响你跑这个项目。但如果你想把代码备份到 GitHub / 提交版本：
```powershell
winget install Git.Git
```
然后 `git init` + `git add .` + `git commit -m "init"`。

---

## 项目结构

```
pace-app/
├── app/                        Expo Router 文件路由
│   ├── _layout.tsx             根布局，定义所有路由的 Stack 导航
│   └── index.tsx               待机首页路由
├── src/
│   ├── theme/                  设计 token（颜色 / 字号 / 间距 / 动画曲线）
│   │   └── index.ts
│   ├── components/             可复用组件
│   │   ├── DialCard.tsx        WHOOP 风三联表盘单个 dial
│   │   ├── StartButton.tsx     大型出发按钮（带光晕、靶环、四角标）
│   │   ├── TimelineDots.tsx    14 天活力点
│   │   └── PhoneStatusBar.tsx  iPhone 顶部状态栏（仿 iOS）
│   └── screens/                屏幕组件
│       └── IdleHome.tsx        Phone 01 待机首页
├── assets/                     字体 / 图片 / 启动屏（暂空）
├── app.json                    Expo 元配置（包名、权限、splash）
├── package.json                依赖
├── tsconfig.json               TypeScript 配置
├── babel.config.js             Babel + Reanimated 插件
├── BRAND.md                    设计规范（颜色 / 字体 / 排版） — 下轮交付
├── PRD.md                      16 屏完整需求文档 — 下轮交付
└── ARCHITECTURE.md             技术决策与模块拆分 — 下轮交付
```

---

## 当前 v0.2 实现进度

| 屏 | 状态 | 备注 |
|---|---|---|
| **01 待机首页** | ✅ 完整实现 | 三联表盘 + 出发按钮 + 14 天时间线 |
| **02 跑前预热** | ✅ 完整实现 | 倒数环 3→2→1→出发 + 4 项系统检查 + 触觉反馈 |
| **03 跑步进行中** | ✅ 完整实现 | 实时计时 + 模拟配速/距离/心率 + 长按 1.5s 暂停 |
| **12 暂停状态** | ✅ 完整实现 | 冻结数据 + 继续/结束按钮 + 二次确认 Alert |
| 04 结束总结 | ⏳ v0.3 | |
| 05 分享卡 | ⏳ v0.3 | |
| 06-08 数据页 | ⏳ 后续 | |
| 09 AI 教练 | ⏳ 后续 | |
| 10 设置 | ⏳ 后续 | |
| 11/16 深入页 | ⏳ 后续 | |
| 13-15 状态变体 | ⏳ 后续 | |

### v0.2 完整可走通的流程

```
首页 [出发] → 跑前预热（3-2-1 倒数）→ 跑步中（实时数字爬升）
            → 长按 1.5 秒 → 暂停页（继续 / 结束）
            → 「结束」二次确认 → 回到首页
```

### Mock 模式说明

v0.2 用的是**模拟传感器数据**：
- **配速**：基线 5'30"/km，每秒 ± 15s 随机噪声
- **距离**：按当前配速每秒推进 ~3 米
- **心率**：145-160 BPM 随机浮动
- **GPS / 路线**：未模拟（v0.3 加入路线 SVG 渲染）

真实 GPS / Apple Watch HealthKit / TTS 语音播报会在 v0.4 「真实传感器集成」那一轮逐个替换。

---

## 技术栈

- **框架**：Expo SDK 51 + React Native 0.74 + TypeScript（严格模式）
- **路由**：Expo Router 3（基于文件系统，类似 Next.js）
- **图形**：react-native-svg 15（所有 SVG 图表/路线/粒子）
- **动画**：react-native-reanimated 3（呼吸光晕、按钮缩放、心跳）
- **手势**：react-native-gesture-handler 2（长按暂停）
- **触觉反馈**：expo-haptics（每公里播报震动）
- **状态**：暂无（后续接入 Zustand）
- **持久化**：暂无（后续接入 AsyncStorage）

---

## 上架到 App Store（不需要 Mac）

将来 v1.0 准备发布时：

```powershell
# 注册 Expo 账号 + EAS CLI
npx eas-cli login

# 配置 iOS 构建
npx eas-cli build:configure

# 云端构建 .ipa（约 15 分钟，免费 tier 每月 30 次）
npx eas-cli build --platform ios

# 直接提交到 App Store Connect（需要 Apple Developer 账号 ¥688/年）
npx eas-cli submit --platform ios
```

整个上架流程**不需要本地 Mac**。EAS Build 会用 Expo 的云端 Mac 构建。

---

## 反馈

这是个人项目，欢迎在 issue 里反馈。或直接对话：

```
"✦ Pace 教练，我跑了 5 公里但感觉好累，正常吗？"
```

（这个能力会在 Phone 09 实现。）
