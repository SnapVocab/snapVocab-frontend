# SnapVocab Icon Refactor Guidelines & Master Matrix

> **Source of Truth** cho toàn bộ quy tắc phân loại icon và refactor visual assets trong SnapVocab.

---

## 1. Master Icon Refactor Matrix

| Current / likely icon | Chức năng          | Quyết định               | Component / Asset mới   |
| --------------------- | ------------------ | ------------------------ | ----------------------- |
| `FlameIcon`           | Streak             | 🔴 **REPLACE_CUSTOM_3D** | `StreakFlame3D`         |
| `TrophyIcon`          | Achievement        | 🔴 **REPLACE_CUSTOM_3D** | `AchievementTrophy3D`   |
| `MedalIcon`           | Achievement        | 🔴 **REPLACE_CUSTOM_3D** | `AchievementBadge3D`    |
| `CrownIcon`           | Rank / achievement | 🔴 **REPLACE_CUSTOM_3D** | `CrownReward3D`         |
| `CoinsIcon`           | Currency           | 🔴 **REPLACE_CUSTOM_3D** | `Coin3D`                |
| `ZapIcon`             | XP / booster       | 🔴 **REPLACE_CUSTOM_3D** | `XPOrb3D` / `Booster3D` |
| `GiftIcon`            | Reward             | 🔴 **REPLACE_CUSTOM_3D** | `RewardGift3D`          |
| `GemIcon`             | Premium currency   | 🟠 **CREATE_NEW_ASSET**  | `Gem3D`                 |
| `PackageIcon`         | Inventory item     | 🟠 **CREATE_NEW_ASSET**  | `MysteryBox3D`          |
| `BoxIcon`             | Chest              | 🔴 **REPLACE_CUSTOM_3D** | `RewardChest3D`         |
| `BadgeIcon`           | Achievement        | 🔴 **REPLACE_CUSTOM_3D** | `AchievementBadge3D`    |
| `StarIcon`            | XP / reward        | 🔴 **REPLACE_CUSTOM_3D** | `XPStar3D`              |
| `HeartIcon`           | Lives / energy     | 🟠 **CREATE_NEW_ASSET**  | `HeartEnergy3D`         |
| `TargetIcon`          | Mission            | 🟠 **CREATE_NEW_ASSET**  | `MissionTarget3D`       |
| `MedalIcon`           | Mission completion | 🔴 **REPLACE_CUSTOM_3D** | `MissionMedal3D`        |
| `CircleCheck`         | Completed state    | 🟢 **KEEP_LUCIDE**       | `CircleCheck`           |
| `CheckCircle2Icon`    | Success            | 🟢 **KEEP_LUCIDE**       | `CheckCircle2`          |
| `CheckIcon`           | Selection          | 🟢 **KEEP_LUCIDE**       | `Check`                 |
| `XIcon`               | Close / incorrect  | 🟢 **KEEP_LUCIDE**       | `X`                     |
| `XCircleIcon`         | Error              | 🟢 **KEEP_LUCIDE**       | `XCircle`               |
| `PlusIcon`            | Add                | 🟢 **KEEP_LUCIDE**       | `Plus`                  |
| `MinusIcon`           | Remove             | 🟢 **KEEP_LUCIDE**       | `Minus`                 |
| `ChevronLeft`         | Back/navigation    | 🟢 **KEEP_LUCIDE**       | `ChevronLeft`           |
| `ChevronRight`        | Next               | 🟢 **KEEP_LUCIDE**       | `ChevronRight`          |
| `ChevronDown`         | Dropdown           | 🟢 **KEEP_LUCIDE**       | `ChevronDown`           |
| `ChevronUp`           | Collapse           | 🟢 **KEEP_LUCIDE**       | `ChevronUp`             |
| `ArrowLeft`           | Back               | 🟢 **KEEP_LUCIDE**       | `ArrowLeft`             |
| `ArrowRight`          | Next               | 🟢 **KEEP_LUCIDE**       | `ArrowRight`            |
| `SearchIcon`          | Search             | 🟢 **KEEP_LUCIDE**       | `Search`                |
| `BellIcon`            | Notification       | 🟢 **KEEP_LUCIDE**       | `Bell`                  |
| `SettingsIcon`        | Settings           | 🟢 **KEEP_LUCIDE**       | `Settings`              |
| `MoreHorizontal`      | More menu          | 🟢 **KEEP_LUCIDE**       | `MoreHorizontal`        |
| `Ellipsis`            | More               | 🟢 **KEEP_LUCIDE**       | `Ellipsis`              |
| `FilterIcon`          | Filter             | 🟢 **KEEP_LUCIDE**       | `Filter`                |
| `SlidersHorizontal`   | Filters            | 🟢 **KEEP_LUCIDE**       | `SlidersHorizontal`     |
| `EditIcon`            | Edit               | 🟢 **KEEP_LUCIDE**       | `Edit3`                 |
| `TrashIcon`           | Delete             | 🟢 **KEEP_LUCIDE**       | `Trash2`                |
| `PencilIcon`          | Edit               | 🟢 **KEEP_LUCIDE**       | `Pencil`                |
| `ShareIcon`           | Share              | 🟢 **KEEP_LUCIDE**       | `Share2`                |
| `CopyIcon`            | Copy               | 🟢 **KEEP_LUCIDE**       | `Copy`                  |
| `DownloadIcon`        | Download           | 🟢 **KEEP_LUCIDE**       | `Download`              |
| `UploadIcon`          | Upload             | 🟢 **KEEP_LUCIDE**       | `Upload`                |

---

## 2. Rules for AI Coding Agent

### Rule 1: Hybrid Icon System
SnapVocab uses two visual systems:
- **`KEEP_LUCIDE`**: Use `lucide-react-native` ONLY for functional UI actions (Navigation, Back/Next, Close, Search, Filter, Settings, Bell, Edit, Delete, Share, Copy, Upload/Download, Check/X, Chevrons, Camera controls, Audio controls, Calendar/Clock, Info, Menu). These icons MUST remain visually secondary to content.
- **`REPLACE_CUSTOM_3D`**: NEVER use generic Lucide icons as primary visual representations of Streak, Coins, XP, Achievements, Trophy, Medal, Crown, Chest, Gifts, Boosters, Mastered state, Major reward states, Level-up states. Replace them with branded SnapVocab 3D assets.
- **`CREATE_NEW_ASSET`**: Create branded visual assets for Object recognition illustrations, Mission illustrations, Empty states, Scan success, Level up, Perfect result, Mastered state, Reward moments, Booster items, Cosmetic items, Chest variants, Snapy interaction scenes.

### Rule 2: Do Not Over-Replace Lucide
Small functional actions retain standard Lucide icons (`<Check size={20} />`, `<Search size={20} />`, `<ChevronRight size={18} />`). 3D assets are strictly reserved for emotional, branded, collectible, reward, progression, and hero visual states.

### Rule 3: Never Use Emoji as Production Assets
Do not use emojis (`🔥 🪙 🏆 🎁 ⚡ 💎 ❤️ ⭐`) in production UI. Use corresponding SnapVocab custom 3D components (`StreakFlame3D`, `Coin3D`, `AchievementBadge3D`, `RewardGift3D`, `XPOrb3D`, `Gem3D`, `HeartEnergy3D`, `XPStar3D`).

### Rule 4: Color & Semantic Rules
- Primary: `#58CC02` (Actions / progress / correct)
- Mascot: `#FF8A00` (Snapy / streak / scan identity)
- Reward: `#FFC42E` (Gold/yellow reserved for rewards)
- Info: `#1CB0F6` (Informational)
- **Constraint**: Snapy must NEVER turn green. Primary CTA must NEVER turn orange.

### Rule 5: Component Abstraction
Do not import individual reward assets directly throughout the application. Prefer abstraction components:
```tsx
<RewardIcon type="coin" />
<RewardIcon type="xp" />
<RewardIcon type="streak" />
<RewardIcon type="chest" />
```
```tsx
<AchievementBadge achievement={achievement} />
<MissionIcon mission={mission} />
```

### Rule 6: Business Logic Preservation
This refactor is purely presentation/visual layer. DO NOT modify API contracts, state management, routing, XP/coin/streak calculations, SRS logic, or authentication.
