/**
 * 16种人格的趣味昵称和头像配置
 * 每种类型有专属主题色、emoji、昵称和简短描述
 */

export interface PersonalityAvatar {
  type: string;
  nickname: string;          // 趣味昵称
  emoji: string;             // 代表emoji
  themeColor: string;        // 主题渐变起始色
  themeColorEnd: string;     // 主题渐变结束色
  bgColor: string;           // 背景浅色
  bgGradient: string;        // 卡片头部渐变
  shortTag: string;          // 一句话标签
}

export const personalityAvatars: Record<string, PersonalityAvatar> = {
  // === 分析家阵营 (NT) ===
  INTJ: {
    type: 'INTJ',
    nickname: '老紫头',
    emoji: '🟣',
    themeColor: '#7C3AED',
    themeColorEnd: '#4C1D95',
    bgColor: '#F5F3FF',
    bgGradient: 'from-violet-100 via-purple-50 to-indigo-50',
    shortTag: '沉默的幕后大佬',
  },
  INTP: {
    type: 'INTP',
    nickname: '脑暴怪',
    emoji: '👽',
    themeColor: '#10B981',
    themeColorEnd: '#047857',
    bgColor: '#ECFDF5',
    bgGradient: 'from-emerald-100 via-teal-50 to-green-50',
    shortTag: '深夜还在想宇宙',
  },
  ENTJ: {
    type: 'ENTJ',
    nickname: '大魔王',
    emoji: '👑',
    themeColor: '#EF4444',
    themeColorEnd: '#991B1B',
    bgColor: '#FEF2F2',
    bgGradient: 'from-red-100 via-rose-50 to-orange-50',
    shortTag: '生来就要赢',
  },
  ENTP: {
    type: 'ENTP',
    nickname: '嘴强王者',
    emoji: '🎤',
    themeColor: '#F59E0B',
    themeColorEnd: '#B45309',
    bgColor: '#FFFBEB',
    bgGradient: 'from-amber-100 via-yellow-50 to-orange-50',
    shortTag: '抬杠是艺术',
  },

  // === 外交家阵营 (NF) ===
  INFJ: {
    type: 'INFJ',
    nickname: '通透猫',
    emoji: '🦉',
    themeColor: '#3B82F6',
    themeColorEnd: '#1D4ED8',
    bgColor: '#EFF6FF',
    bgGradient: 'from-blue-100 via-indigo-50 to-violet-50',
    shortTag: '看穿灵魂的温柔',
  },
  INFP: {
    type: 'INFP',
    nickname: '折纸鹿',
    emoji: '🦌',
    themeColor: '#06B6D4',
    themeColorEnd: '#0E7490',
    bgColor: '#ECFEFF',
    bgGradient: 'from-cyan-100 via-teal-50 to-sky-50',
    shortTag: '心里住了个宇宙',
  },
  ENFJ: {
    type: 'ENFJ',
    nickname: '鸡血王',
    emoji: '☀️',
    themeColor: '#F59E0B',
    themeColorEnd: '#D97706',
    bgColor: '#FFFBEB',
    bgGradient: 'from-amber-100 via-yellow-50 to-rose-50',
    shortTag: '天生的引路人',
  },
  ENFP: {
    type: 'ENFP',
    nickname: '快乐狗',
    emoji: '🐕',
    themeColor: '#F97316',
    themeColorEnd: '#C2410C',
    bgColor: '#FFF7ED',
    bgGradient: 'from-orange-100 via-amber-50 to-yellow-50',
    shortTag: '眼里有光心里有火',
  },

  // === 守卫者阵营 (SJ) ===
  ISTJ: {
    type: 'ISTJ',
    nickname: '铁头哥',
    emoji: '🤖',
    themeColor: '#6B7280',
    themeColorEnd: '#374151',
    bgColor: '#F9FAFB',
    bgGradient: 'from-gray-100 via-slate-50 to-zinc-50',
    shortTag: '靠谱是最性感的标签',
  },
  ISFJ: {
    type: 'ISFJ',
    nickname: '暖宝宝',
    emoji: '🌸',
    themeColor: '#EC4899',
    themeColorEnd: '#BE185D',
    bgColor: '#FDF2F8',
    bgGradient: 'from-pink-100 via-rose-50 to-fuchsia-50',
    shortTag: '温柔守护刻在骨子里',
  },
  ESTJ: {
    type: 'ESTJ',
    nickname: '铁面人',
    emoji: '⚔️',
    themeColor: '#1F2937',
    themeColorEnd: '#111827',
    bgColor: '#F3F4F6',
    bgGradient: 'from-gray-200 via-slate-100 to-zinc-100',
    shortTag: '用秩序征服一切',
  },
  ESFJ: {
    type: 'ESFJ',
    nickname: '团妈',
    emoji: '🍰',
    themeColor: '#D97706',
    themeColorEnd: '#92400E',
    bgColor: '#FFFBEB',
    bgGradient: 'from-amber-100 via-orange-50 to-yellow-50',
    shortTag: '全世界最温暖的纽带',
  },

  // === 探险家阵营 (SP) ===
  ISTP: {
    type: 'ISTP',
    nickname: '拆家王',
    emoji: '🔧',
    themeColor: '#F97316',
    themeColorEnd: '#9A3412',
    bgColor: '#FFF7ED',
    bgGradient: 'from-orange-100 via-amber-50 to-stone-50',
    shortTag: '冷静外壳自由灵魂',
  },
  ISFP: {
    type: 'ISFP',
    nickname: '调色盘',
    emoji: '🎨',
    themeColor: '#A855F7',
    themeColorEnd: '#7E22CE',
    bgColor: '#FAF5FF',
    bgGradient: 'from-fuchsia-100 via-purple-50 to-pink-50',
    shortTag: '生活是首即兴诗',
  },
  ESTP: {
    type: 'ESTP',
    nickname: '冲浪王',
    emoji: '🏄',
    themeColor: '#EF4444',
    themeColorEnd: '#B91C1C',
    bgColor: '#FEF2F2',
    bgGradient: 'from-red-100 via-orange-50 to-amber-50',
    shortTag: '人生苦短干了再说',
  },
  ESFP: {
    type: 'ESFP',
    nickname: '蹦迪王',
    emoji: '🎉',
    themeColor: '#8B5CF6',
    themeColorEnd: '#6D28D9',
    bgColor: '#F5F3FF',
    bgGradient: 'from-violet-100 via-purple-50 to-fuchsia-50',
    shortTag: '天生C位快乐超能力',
  },
};

/** 获取阵营名 */
export function getCampName(type: string): string {
  const second = type[1];
  const third = type[2];
  if (second === 'N' && third === 'T') return '分析家';
  if (second === 'N' && third === 'F') return '外交家';
  if (second === 'S' && third === 'J') return '守卫者';
  if (second === 'S' && third === 'P') return '探险家';
  return '未知';
}
