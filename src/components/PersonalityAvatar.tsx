'use client';

import { personalityAvatars, getCampName } from '@/lib/personality-avatars';

interface PersonalityAvatarProps {
  mbtiType: string;
  revealed: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PersonalityAvatar({ mbtiType, revealed, size = 'md' }: PersonalityAvatarProps) {
  const avatar = personalityAvatars[mbtiType];
  
  // 尺寸映射
  const sizeMap = {
    sm: { container: 'w-16 h-16', emoji: 'text-2xl' },
    md: { container: 'w-24 h-24', emoji: 'text-4xl' },
    lg: { container: 'w-32 h-32', emoji: 'text-5xl' },
  };
  
  const s = sizeMap[size];
  
  if (!avatar) {
    // Fallback: 通用头像
    return (
      <div className={`${s.container} rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-200`}>
        <span className={s.emoji}>❓</span>
      </div>
    );
  }

  const camp = getCampName(mbtiType);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 头像圆圈 */}
      <div
        className={`
          ${s.container} rounded-full flex items-center justify-center
          transition-all duration-700 relative overflow-hidden
          ${revealed
            ? 'shadow-lg border-3'
            : 'border-2 border-gray-200 grayscale opacity-60'
          }
        `}
        style={revealed ? {
          background: `linear-gradient(135deg, ${avatar.themeColor}20, ${avatar.themeColorEnd}10)`,
          boxShadow: `0 4px 14px ${avatar.themeColor}30`,
          borderColor: avatar.themeColor,
        } : {}}
      >
        {/* 背景图案 */}
        <div
          className="absolute inset-0 opacity-20"
          style={revealed ? {
            background: `radial-gradient(circle at 30% 30%, ${avatar.themeColor}40, transparent 60%)`,
          } : {}}
        />
        
        {/* Emoji */}
        <span className={`${s.emoji} relative z-10 transition-all duration-500`}>
          {revealed ? avatar.emoji : '🔒'}
        </span>
      </div>

      {/* 昵称 + 阵营标签（仅在解锁后显示） */}
      {revealed && (
        <div className="text-center animate-fade-in">
          <div
            className="text-sm font-bold"
            style={{ color: avatar.themeColor }}
          >
            {avatar.nickname}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {camp}阵营
          </div>
        </div>
      )}
    </div>
  );
}
