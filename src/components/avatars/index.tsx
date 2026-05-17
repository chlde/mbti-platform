/**
 * 16种MBTI人格卡通形象 - 纯SVG内联组件
 * 参考16personalities风格：4大阵营配色 + 独特角色造型
 * 
 * 分析家(NT) 紫色系 | 外交家(NF) 绿色系
 * 守卫者(SJ) 蓝色系 | 探险家(SP) 黄色系
 */

import React from 'react';

interface AvatarProps {
  size?: number;
  className?: string;
}

// ===== 分析家阵营 (NT) - 紫色系 =====

export function INTJAvatar({ size = 120, className }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* 身体 */}
      <ellipse cx="60" cy="95" rx="28" ry="18" fill="#8E44AD" opacity="0.9"/>
      {/* 头 */}
      <circle cx="60" cy="52" r="30" fill="#F5E6FF"/>
      {/* 头发 - 整齐短发 */}
      <path d="M30 48C30 30 42 22 60 22C78 22 90 30 90 48C90 42 82 35 60 35C38 35 30 42 30 48Z" fill="#4A235A"/>
      <path d="M32 45C32 32 44 24 60 24C76 24 88 32 88 45" fill="#4A235A"/>
      {/* 眼镜 */}
      <rect x="42" y="48" width="14" height="12" rx="3" stroke="#4A235A" strokeWidth="2" fill="none"/>
      <rect x="64" y="48" width="14" height="12" rx="3" stroke="#4A235A" strokeWidth="2" fill="none"/>
      <line x1="56" y1="54" x2="64" y2="54" stroke="#4A235A" strokeWidth="2"/>
      {/* 眼睛 - 冷静犀利 */}
      <circle cx="49" cy="54" r="2.5" fill="#4A235A"/>
      <circle cx="71" cy="54" r="2.5" fill="#4A235A"/>
      {/* 嘴 - 微妙微笑 */}
      <path d="M54 64Q60 67 66 64" stroke="#4A235A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* 图纸装饰 */}
      <rect x="78" y="72" width="16" height="20" rx="2" fill="#F5E6FF" stroke="#8E44AD" strokeWidth="1"/>
      <line x1="81" y1="78" x2="91" y2="78" stroke="#8E44AD" strokeWidth="1"/>
      <line x1="81" y1="82" x2="88" y2="82" stroke="#8E44AD" strokeWidth="1"/>
      <line x1="81" y1="86" x2="91" y2="86" stroke="#8E44AD" strokeWidth="1"/>
    </svg>
  );
}

export function INTPAvatar({ size = 120, className }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      <ellipse cx="60" cy="95" rx="28" ry="18" fill="#8E44AD" opacity="0.9"/>
      <circle cx="60" cy="52" r="30" fill="#F5E6FF"/>
      {/* 头发 - 乱蓬蓬 */}
      <path d="M28 50C28 28 40 18 60 18C80 18 92 28 92 50C92 38 84 25 60 25C36 25 28 38 28 50Z" fill="#4A235A"/>
      <path d="M35 42C37 35 42 22 55 20" stroke="#4A235A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M50 19C55 16 70 15 80 20" stroke="#4A235A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M75 22C82 26 88 34 88 42" stroke="#4A235A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 眼睛 - 大而好奇 */}
      <circle cx="47" cy="52" r="5" fill="white" stroke="#4A235A" strokeWidth="1.5"/>
      <circle cx="73" cy="52" r="5" fill="white" stroke="#4A235A" strokeWidth="1.5"/>
      <circle cx="48" cy="52" r="2.5" fill="#4A235A"/>
      <circle cx="74" cy="52" r="2.5" fill="#4A235A"/>
      {/* 嘴 - 思考 */}
      <ellipse cx="60" cy="65" rx="3" ry="2" fill="#4A235A" opacity="0.6"/>
      {/* 头顶灯泡 */}
      <circle cx="82" cy="18" r="8" fill="#F9E79F" stroke="#F39C12" strokeWidth="1.5"/>
      <line x1="82" y1="12" x2="82" y2="8" stroke="#F39C12" strokeWidth="1"/>
      <line x1="88" y1="15" x2="92" y2="13" stroke="#F39C12" strokeWidth="1"/>
      <line x1="76" y1="15" x2="72" y2="13" stroke="#F39C12" strokeWidth="1"/>
    </svg>
  );
}

export function ENTJAvatar({ size = 120, className }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      <ellipse cx="60" cy="95" rx="28" ry="18" fill="#8E44AD" opacity="0.9"/>
      <circle cx="60" cy="52" r="30" fill="#F5E6FF"/>
      {/* 头发 - 干练背头 */}
      <path d="M30 48C30 30 42 22 60 22C78 22 90 30 90 48C90 40 80 30 60 30C40 30 30 40 30 48Z" fill="#4A235A"/>
      <path d="M30 46C30 40 36 32 46 30" stroke="#4A235A" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M90 46C90 40 84 32 74 30" stroke="#4A235A" strokeWidth="6" fill="none" strokeLinecap="round"/>
      {/* 眼睛 - 自信 */}
      <path d="M42 50L52 50" stroke="#4A235A" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M68 50L78 50" stroke="#4A235A" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="47" cy="52" r="2.5" fill="#4A235A"/>
      <circle cx="73" cy="52" r="2.5" fill="#4A235A"/>
      {/* 嘴 - 自信微笑 */}
      <path d="M52 64Q60 69 68 64" stroke="#4A235A" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 皇冠 */}
      <path d="M42 28L46 20L52 26L60 16L68 26L74 20L78 28" fill="#F1C40F" stroke="#D4AC0D" strokeWidth="1"/>
      <rect x="42" y="28" width="36" height="4" rx="1" fill="#F1C40F" stroke="#D4AC0D" strokeWidth="0.5"/>
    </svg>
  );
}

export function ENTPAvatar({ size = 120, className }: AvatarProps) {
  return (
    <svg width={size} height={0} viewBox="0 0 120 120" fill="none" className={className}>
    </svg>
  );
}

// placeholder - will generate the rest
