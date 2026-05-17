'use client';

import React from 'react';
import Image from 'next/image';

interface CharacterImageProps {
  mbtiType: string;
  revealed?: boolean;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLabel?: boolean;
}

// 4大阵营主题色
const GROUP_COLORS: Record<string, { primary: string; light: string; dark: string; bg: string }> = {
  '分析家': { primary: '#9B59B6', light: '#D2B4DE', dark: '#6C3483', bg: '#F5EEF8' },
  '外交家': { primary: '#27AE60', light: '#82E0AA', dark: '#1E8449', bg: '#EAFAF1' },
  '守卫者': { primary: '#2980B9', light: '#85C1E9', dark: '#1F618D', bg: '#EBF5FB' },
  '探险家': { primary: '#F39C12', light: '#F9E79F', dark: '#D68910', bg: '#FEF9E7' },
};

function getCampName(type: string): string {
  const second = type[1];
  if (second === 'N') {
    const third = type[2];
    if (third === 'T') return '分析家';
    return '外交家';
  }
  const third = type[2];
  if (third === 'J') return '守卫者';
  return '探险家';
}

const TYPE_NAMES: Record<string, string> = {
  INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家',
  INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者',
  ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官',
  ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者',
};

const sizeMap = {
  sm: 80,
  md: 140,
  lg: 200,
  xl: 280,
};

export default function CharacterImage({ mbtiType, revealed = true, size = 'md', className = '', showLabel = true }: CharacterImageProps) {
  const camp = getCampName(mbtiType);
  const colors = GROUP_COLORS[camp] || GROUP_COLORS['分析家'];
  const px = typeof size === 'number' ? size : sizeMap[size];
  const typeName = TYPE_NAMES[mbtiType] || mbtiType;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className="rounded-full overflow-hidden transition-all duration-700 relative"
        style={{
          width: px,
          height: px,
          background: `linear-gradient(135deg, ${colors.bg}, ${colors.light}60)`,
          border: `3px solid ${revealed ? colors.primary : '#ccc'}`,
          boxShadow: revealed ? `0 8px 24px ${colors.primary}30` : '0 4px 12px rgba(0,0,0,0.1)',
          filter: revealed ? 'none' : 'blur(6px) grayscale(0.5)',
        }}
      >
        <Image
          src={`/images/characters/${mbtiType}.png`}
          alt={`${mbtiType} ${typeName}`}
          width={px}
          height={px}
          className="object-cover"
          priority={typeof size !== 'string' || size === 'lg' || size === 'xl'}
        />
      </div>
      {showLabel && (
        <div className="text-center transition-all duration-700">
          <div className="text-sm font-bold" style={{ color: revealed ? colors.primary : '#aaa' }}>
            {revealed ? typeName : '???'}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{revealed ? camp : '分享后解锁'}</div>
        </div>
      )}
    </div>
  );
}

// 导出供其他组件使用的工具函数
export { getCampName, GROUP_COLORS, TYPE_NAMES };
