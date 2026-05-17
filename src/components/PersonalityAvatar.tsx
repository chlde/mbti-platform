'use client';

import React from 'react';
import { personalityAvatars, getCampName } from '@/lib/personality-avatars';

interface PersonalityAvatarProps {
  mbtiType: string;
  revealed: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// 4大阵营主题色
const GROUP_COLORS: Record<string, { primary: string; light: string; dark: string; bg: string }> = {
  '分析家': { primary: '#9B59B6', light: '#D2B4DE', dark: '#6C3483', bg: '#F5EEF8' },
  '外交家': { primary: '#27AE60', light: '#82E0AA', dark: '#1E8449', bg: '#EAFAF1' },
  '守卫者': { primary: '#2980B9', light: '#85C1E9', dark: '#1F618D', bg: '#EBF5FB' },
  '探险家': { primary: '#F39C12', light: '#F9E79F', dark: '#D68910', bg: '#FEF9E7' },
};

// 16种人格的独特装饰物（放在角色旁边）
const TYPE_ACCESSORY: Record<string, string> = {
  INTJ: '📐', INTP: '💡', ENTJ: '👑', ENTP: '⚡',
  INFJ: '🔮', INFP: '🦋', ENFJ: '☀️', ENFP: '🌈',
  ISTJ: '📋', ISFJ: '🛡️', ESTJ: '📊', ESFJ: '🎁',
  ISTP: '🔧', ISFP: '🎨', ESTP: '⚡', ESFP: '🎉',
};

// 头发样式：每种人格不同发型
const HAIR_STYLE: Record<string, 'short' | 'messy' | 'slick' | 'spiky' | 'long' | 'curly' | 'bob' | 'ponytail' | 'flat' | 'wavy' | 'neat' | 'bun' | 'braids' | 'pixie' | 'mohawk' | 'afro'> = {
  INTJ: 'short', INTP: 'messy', ENTJ: 'slick', ENTP: 'spiky',
  INFJ: 'long', INFP: 'wavy', ENFJ: 'bob', ENFP: 'curly',
  ISTJ: 'flat', ISFJ: 'neat', ESTJ: 'short', ESFJ: 'ponytail',
  ISTP: 'messy', ISFP: 'long', ESTP: 'mohawk', ESFP: 'afro',
};

function HairSvg({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'short':
      return <path d="M30 48C30 30 42 22 60 22C78 22 90 30 90 48C90 42 80 32 60 32C40 32 30 42 30 48Z" fill={color}/>;
    case 'messy':
      return (<>
        <path d="M28 50C28 28 40 18 60 18C80 18 92 28 92 50C92 38 82 24 60 24C38 24 28 38 28 50Z" fill={color}/>
        <path d="M38 40C40 32 48 18 60 16" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M52 16C58 13 72 12 82 17" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M78 20C85 24 90 34 90 42" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
      </>);
    case 'slick':
      return (<>
        <path d="M30 46C30 30 42 22 60 22C78 22 90 30 90 46C90 38 82 28 60 28C38 28 30 38 30 46Z" fill={color}/>
        <path d="M30 44C32 36 40 28 50 26" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M90 44C88 36 80 28 70 26" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
      </>);
    case 'spiky':
      return (<>
        <path d="M30 48C30 32 42 24 60 24C78 24 90 32 90 48C90 40 82 30 60 30C38 30 30 40 30 48Z" fill={color}/>
        <path d="M40 38L45 20L50 35" fill={color}/>
        <path d="M50 32L57 12L62 30" fill={color}/>
        <path d="M60 30L67 10L72 28" fill={color}/>
        <path d="M70 32L78 18L80 36" fill={color}/>
      </>);
    case 'long':
      return (<>
        <path d="M28 50C28 30 40 22 60 22C80 22 92 30 92 50L92 70C92 74 88 76 86 72L86 50C86 38 78 30 60 30C42 30 34 38 34 50L34 72C34 76 30 74 28 70Z" fill={color}/>
      </>);
    case 'wavy':
      return (<>
        <path d="M28 52C28 30 40 20 60 20C80 20 92 30 92 52" fill={color}/>
        <path d="M28 52C26 56 28 60 32 58C34 54 32 50 28 52" fill={color}/>
        <path d="M36 52C34 58 36 64 40 60C42 54 38 50 36 52" fill={color}/>
        <path d="M84 52C86 56 84 60 80 58C78 54 82 50 84 52" fill={color}/>
        <path d="M78 54C80 58 78 62 74 58C72 52 76 50 78 54" fill={color}/>
      </>);
    case 'bob':
      return (<>
        <path d="M30 48C30 30 42 22 60 22C78 22 90 30 90 48L90 60C90 64 86 66 84 62C82 48 74 32 60 32C46 32 38 48 36 62C34 66 30 64 30 60Z" fill={color}/>
      </>);
    case 'curly':
      return (<>
        <circle cx="36" cy="42" r="10" fill={color}/>
        <circle cx="48" cy="34" r="10" fill={color}/>
        <circle cx="60" cy="30" r="10" fill={color}/>
        <circle cx="72" cy="34" r="10" fill={color}/>
        <circle cx="84" cy="42" r="10" fill={color}/>
        <circle cx="30" cy="50" r="8" fill={color}/>
        <circle cx="90" cy="50" r="8" fill={color}/>
      </>);
    case 'flat':
      return <path d="M30 48C30 34 42 26 60 26C78 26 90 34 90 48C90 44 82 36 60 36C38 36 30 44 30 48Z" fill={color}/>;
    case 'neat':
      return (<>
        <path d="M32 48C32 32 44 24 60 24C76 24 88 32 88 48C88 42 80 32 60 32C40 32 32 42 32 48Z" fill={color}/>
        <circle cx="60" cy="24" r="6" fill={color}/>
      </>);
    case 'ponytail':
      return (<>
        <path d="M32 48C32 32 44 24 60 24C76 24 88 32 88 48C88 40 80 32 60 32C40 32 32 40 32 48Z" fill={color}/>
        <ellipse cx="88" cy="44" rx="6" ry="14" fill={color} transform="rotate(20 88 44)"/>
      </>);
    case 'mohawk':
      return (<>
        <path d="M30 50C30 36 42 28 60 28C78 28 90 36 90 50" fill={color}/>
        <path d="M50 38L55 10L60 36L65 8L70 38" fill={color}/>
      </>);
    case 'afro':
      return <circle cx="60" cy="40" r="34" fill={color}/>;
    default:
      return <path d="M30 48C30 30 42 22 60 22C78 22 90 30 90 48C90 42 80 32 60 32C40 32 30 42 30 48Z" fill={color}/>;
  }
}

// 眼睛样式
const EYE_STYLE: Record<string, 'sharp' | 'round' | 'wink' | 'sparkle' | 'squint' | 'gentle'> = {
  INTJ: 'sharp', INTP: 'round', ENTJ: 'sharp', ENTP: 'sparkle',
  INFJ: 'gentle', INFP: 'sparkle', ENFJ: 'round', ENFP: 'sparkle',
  ISTJ: 'squint', ISFJ: 'gentle', ESTJ: 'sharp', ESFJ: 'round',
  ISTP: 'squint', ISFP: 'gentle', ESTP: 'sparkle', ESFP: 'round',
};

function EyesSvg({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'sharp':
      return (<>
        <path d="M40 52L54 52" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="47" cy="54" r="2.5" fill={color}/>
        <path d="M66 52L80 52" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="73" cy="54" r="2.5" fill={color}/>
      </>);
    case 'round':
      return (<>
        <circle cx="47" cy="52" r="5" fill="white" stroke={color} strokeWidth="1.5"/>
        <circle cx="73" cy="52" r="5" fill="white" stroke={color} strokeWidth="1.5"/>
        <circle cx="48" cy="52" r="2.5" fill={color}/>
        <circle cx="74" cy="52" r="2.5" fill={color}/>
      </>);
    case 'sparkle':
      return (<>
        <circle cx="47" cy="52" r="5.5" fill="white" stroke={color} strokeWidth="1.5"/>
        <circle cx="73" cy="52" r="5.5" fill="white" stroke={color} strokeWidth="1.5"/>
        <circle cx="48" cy="52" r="3" fill={color}/>
        <circle cx="74" cy="52" r="3" fill={color}/>
        <circle cx="50" cy="50" r="1.5" fill="white"/>
        <circle cx="76" cy="50" r="1.5" fill="white"/>
      </>);
    case 'squint':
      return (<>
        <path d="M41 53Q47 49 53 53" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M67 53Q73 49 79 53" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>);
    case 'gentle':
      return (<>
        <ellipse cx="47" cy="52" rx="4" ry="4.5" fill="white" stroke={color} strokeWidth="1.2"/>
        <ellipse cx="73" cy="52" rx="4" ry="4.5" fill="white" stroke={color} strokeWidth="1.2"/>
        <circle cx="47" cy="52" r="2.5" fill={color}/>
        <circle cx="73" cy="52" r="2.5" fill={color}/>
        <circle cx="49" cy="50" r="1" fill="white"/>
        <circle cx="75" cy="50" r="1" fill="white"/>
      </>);
    default:
      return (<>
        <circle cx="47" cy="52" r="2.5" fill={color}/>
        <circle cx="73" cy="52" r="2.5" fill={color}/>
      </>);
  }
}

// 嘴巴样式
const MOUTH_STYLE: Record<string, 'smile' | 'grin' | 'think' | 'smirk' | 'open' | 'gentle'> = {
  INTJ: 'smirk', INTP: 'think', ENTJ: 'smile', ENTP: 'grin',
  INFJ: 'gentle', INFP: 'smile', ENFJ: 'grin', ENFP: 'open',
  ISTJ: 'smile', ISFJ: 'gentle', ESTJ: 'smile', ESFJ: 'grin',
  ISTP: 'smirk', ISFP: 'gentle', ESTP: 'grin', ESFP: 'open',
};

function MouthSvg({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'smile':
      return <path d="M52 64Q60 68 68 64" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>;
    case 'grin':
      return (<>
        <path d="M50 63Q60 72 70 63" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M52 64Q60 68 68 64" fill={color} opacity="0.3"/>
      </>);
    case 'think':
      return <ellipse cx="60" cy="65" rx="3" ry="2" fill={color} opacity="0.6"/>;
    case 'smirk':
      return <path d="M56 64Q64 67 70 63" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/>;
    case 'open':
      return (<>
        <ellipse cx="60" cy="65" rx="5" ry="4" fill={color} opacity="0.3"/>
        <ellipse cx="60" cy="65" rx="5" ry="4" stroke={color} strokeWidth="1.5" fill="none"/>
      </>);
    case 'gentle':
      return <path d="M54 64Q60 67 66 64" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
    default:
      return <path d="M54 64Q60 67 66 64" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
  }
}

// 脸红（给温暖型人格）
const BLUSH_TYPES = new Set(['INFP', 'ENFJ', 'ENFP', 'ISFJ', 'ESFJ', 'ISFP', 'ESFP']);

export default function PersonalityAvatar({ mbtiType, revealed, size = 'md' }: PersonalityAvatarProps) {
  const avatar = personalityAvatars[mbtiType];
  
  const sizeMap = {
    sm: 80,
    md: 140,
    lg: 200,
  };
  
  const px = sizeMap[size];
  
  if (!avatar) {
    return (
      <div
        className="rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200"
        style={{ width: px, height: px }}
      >
        <span className="text-2xl">❓</span>
      </div>
    );
  }

  const camp = getCampName(mbtiType);
  const colors = GROUP_COLORS[camp] || GROUP_COLORS['分析家'];
  const hairStyle = HAIR_STYLE[mbtiType] || 'short';
  const eyeStyle = EYE_STYLE[mbtiType] || 'round';
  const mouthStyle = MOUTH_STYLE[mbtiType] || 'smile';
  const accessory = TYPE_ACCESSORY[mbtiType] || '✨';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center transition-all duration-700 relative overflow-hidden animate-float"
        style={{
          width: px,
          height: px,
          background: revealed
            ? `linear-gradient(135deg, ${colors.bg}, ${colors.light}40)`
            : '#f3f4f6',
          border: revealed ? `3px solid ${colors.primary}` : '2px solid #e5e7eb',
          boxShadow: revealed ? `0 8px 24px ${colors.primary}30` : 'none',
          filter: revealed ? 'none' : 'grayscale(0.6)',
        }}
      >
        {revealed ? (
          <svg
            width={px * 0.85}
            height={px * 0.85}
            viewBox="0 0 120 120"
            fill="none"
          >
            {/* 身体 */}
            <ellipse cx="60" cy="98" rx="26" ry="16" fill={colors.primary} opacity="0.85"/>
            {/* 脖子 */}
            <rect x="54" y="78" width="12" height="10" rx="4" fill="#FDEBD0"/>
            {/* 头 */}
            <circle cx="60" cy="52" r="30" fill="#FDEBD0"/>
            {/* 头发 */}
            <HairSvg style={hairStyle} color={colors.dark}/>
            {/* 腮红 */}
            {BLUSH_TYPES.has(mbtiType) && (
              <>
                <circle cx="38" cy="60" r="5" fill="#F5B7B1" opacity="0.5"/>
                <circle cx="82" cy="60" r="5" fill="#F5B7B1" opacity="0.5"/>
              </>
            )}
            {/* 眼睛 */}
            <EyesSvg style={eyeStyle} color={colors.dark}/>
            {/* 嘴巴 */}
            <MouthSvg style={mouthStyle} color={colors.dark}/>
            {/* 装饰物 */}
            <text x="88" y="86" fontSize="16">{accessory}</text>
          </svg>
        ) : (
          <span className="text-4xl">🔒</span>
        )}
      </div>

      {revealed && (
        <div className="text-center animate-fade-in">
          <div
            className="text-sm font-bold"
            style={{ color: colors.primary }}
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
