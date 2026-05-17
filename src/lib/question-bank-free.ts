export interface Question {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  poleA: string;   // A端描述（短标签）
  poleB: string;   // B端描述（短标签）
  weightA: 'left' | 'right';
}

// 每次测试从每维度随机抽取7道，共28道
export const QUESTIONS_PER_DIM = 7;
export const TOTAL_DIMS = 4;
export const TOTAL_QUESTIONS = QUESTIONS_PER_DIM * TOTAL_DIMS; // 28

export const freeQuestions: Question[] = [
  // ===== EI维度 (id 1-14) =====
  {
    id: 1, dimension: 'EI',
    text: '周五晚上，朋友突然约你出去聚餐，你的第一反应是？',
    poleA: '太好了，赶紧出发！', poleB: '想在家待着……',
    weightA: 'left',
  },
  {
    id: 2, dimension: 'EI',
    text: '你一个人在家待了三天没出门，现在的状态？',
    poleA: '快憋疯了，赶紧约人', poleB: '挺舒服的，独处很珍贵',
    weightA: 'left',
  },
  {
    id: 3, dimension: 'EI',
    text: '在一个全是陌生人的聚会里，你会？',
    poleA: '主动找人聊天，很快打成一片', poleB: '找个角落待着，等别人来搭话',
    weightA: 'left',
  },
  {
    id: 4, dimension: 'EI',
    text: '遇到一个复杂问题，你更习惯怎么解决？',
    poleA: '拉人一起讨论，碰撞出火花', poleB: '先自己安静想清楚再说',
    weightA: 'left',
  },
  {
    id: 5, dimension: 'EI',
    text: '开了一整天会之后，你最想做什么？',
    poleA: '和同事吃饭吐槽，社交让我放松', poleB: '赶紧回家，一个人待着充电',
    weightA: 'left',
  },
  {
    id: 6, dimension: 'EI',
    text: '刚搬到新城市，周末到了，你更可能？',
    poleA: '主动约同事出去，加入兴趣社群', poleB: '自己逛逛咖啡馆，先适应环境',
    weightA: 'left',
  },
  {
    id: 7, dimension: 'EI',
    text: '你更喜欢哪种聊天方式？',
    poleA: '面对面聊或语音，直接有温度', poleB: '打字聊，可以慢慢组织语言',
    weightA: 'left',
  },
  {
    id: 8, dimension: 'EI',
    text: '团建去KTV，你的状态是？',
    poleA: '抢麦！点歌单早就想好了', poleB: '坐角落听别人唱，偶尔拍拍手',
    weightA: 'left',
  },
  {
    id: 9, dimension: 'EI',
    text: '周末阳光很好，你更想？',
    poleA: '约朋友去户外玩，人多才热闹', poleB: '泡杯茶窝沙发看书，安静享受',
    weightA: 'left',
  },
  {
    id: 10, dimension: 'EI',
    text: '你更喜欢哪种工作环境？',
    poleA: '开放式办公，随时可以讨论交流', poleB: '独立空间，安安静静不被打扰',
    weightA: 'left',
  },
  {
    id: 11, dimension: 'EI',
    text: '有人说你是"社牛"还是"社恐"？',
    poleA: '社牛，到哪都能聊起来', poleB: '社恐，人多了就耗电',
    weightA: 'left',
  },
  {
    id: 12, dimension: 'EI',
    text: '做完一项大工作后，你更想？',
    poleA: '约朋友庆祝一下，分享喜悦', poleB: '给自己一个安静的奖励，独处放松',
    weightA: 'left',
  },
  {
    id: 13, dimension: 'EI',
    text: '坐地铁的时候你通常会？',
    poleA: '跟旁边朋友聊天，或者打电话', poleB: '戴耳机听歌看手机，享受自己的空间',
    weightA: 'left',
  },
  {
    id: 14, dimension: 'EI',
    text: '交新朋友对你来说？',
    poleA: '很容易，我喜欢认识各种人', poleB: '比较慢热，需要时间才熟',
    weightA: 'left',
  },

  // ===== SN维度 (id 15-28) =====
  {
    id: 15, dimension: 'SN',
    text: '你在看一部新剧，朋友问"好看吗"，你怎么回答？',
    poleA: '描述具体特点：节奏、特效、评分', poleB: '描述整体感受：让人想很多，有感觉',
    weightA: 'left',
  },
  {
    id: 16, dimension: 'SN',
    text: '讨论要不要跳槽，你更看重什么？',
    poleA: '薪资、通勤时间、五险一金等实打实的', poleB: '未来发展空间、行业趋势等长远眼光',
    weightA: 'left',
  },
  {
    id: 17, dimension: 'SN',
    text: '老板让你写市场分析报告，你倾向于？',
    poleA: '收集销售数据和调研结果，用图表说话', poleB: '从行业趋势入手，提出前瞻性观点',
    weightA: 'left',
  },
  {
    id: 18, dimension: 'SN',
    text: '路过一家排长队的店，你的第一反应？',
    poleA: '搜一下评价和人均，看看值不值得排', poleB: '直接排队试试，说不定有惊喜',
    weightA: 'left',
  },
  {
    id: 19, dimension: 'SN',
    text: '你看到一个有意思的产品，怎么安利给朋友？',
    poleA: '描述材质、配色、功能等具体细节', poleB: '描述它给你带来的感觉和氛围',
    weightA: 'left',
  },
  {
    id: 20, dimension: 'SN',
    text: '有人说"AI会改变教育"，你的反应？',
    poleA: '追问具体怎么改、有哪些实际案例', poleB: '觉得这个想法很酷，开始畅想未来',
    weightA: 'left',
  },
  {
    id: 21, dimension: 'SN',
    text: '你更相信哪种判断？',
    poleA: '靠经验和事实，看得见摸得着的', poleB: '靠直觉和第六感，感觉对了就对了',
    weightA: 'left',
  },
  {
    id: 22, dimension: 'SN',
    text: '读小说，你更喜欢哪种写法？',
    poleA: '大量细腻的环境描写和对话，像看电影', poleB: '很多隐喻和留白，让人浮想联翩',
    weightA: 'left',
  },
  {
    id: 23, dimension: 'SN',
    text: '做一个重要决定时，你更依赖？',
    poleA: '过往的经验和已知的事实', poleB: '对未来的预感和灵感',
    weightA: 'left',
  },
  {
    id: 24, dimension: 'SN',
    text: '跟朋友描述一次旅行，你更可能说？',
    poleA: '住了哪家酒店、吃了什么菜、花了多少钱', poleB: '那种自由自在的感觉，特别治愈',
    weightA: 'left',
  },
  {
    id: 25, dimension: 'SN',
    text: '买东西之前你会？',
    poleA: '仔细对比参数、看测评、算性价比', poleB: '看眼缘，感觉对了就下手',
    weightA: 'left',
  },
  {
    id: 26, dimension: 'SN',
    text: '你更关注的是？',
    poleA: '当下的实际情况，脚踏实地', poleB: '未来的各种可能性，天马行空',
    weightA: 'left',
  },
  {
    id: 27, dimension: 'SN',
    text: '学习新东西，你更偏好？',
    poleA: '按步骤来，循序渐进掌握基础', poleB: '先看全貌，理解大框架再填细节',
    weightA: 'left',
  },
  {
    id: 28, dimension: 'SN',
    text: '做计划时，你更关注？',
    poleA: '具体的执行步骤和时间节点', poleB: '整体的愿景和方向',
    weightA: 'left',
  },

  // ===== TF维度 (id 29-42) =====
  {
    id: 29, dimension: 'TF',
    text: '朋友兴冲冲给你看她新画的画，但你觉得不好看，她问你觉得怎么样？',
    poleA: '说实话，指出可以改进的地方', poleB: '先肯定她的努力，不想打击热情',
    weightA: 'left',
  },
  {
    id: 30, dimension: 'TF',
    text: '团队里两人因方案吵架，你是组长，怎么处理？',
    poleA: '列出来对比优缺点，用数据说话', poleB: '先让大家冷静，聊聊感受找折中方案',
    weightA: 'left',
  },
  {
    id: 31, dimension: 'TF',
    text: '两款差不多的手机：A配置好性价比高，B是你喜欢的品牌但贵一点？',
    poleA: '买A，品牌溢价不值得', poleB: '买B，用喜欢的牌子心情好值那个差价',
    weightA: 'left',
  },
  {
    id: 32, dimension: 'TF',
    text: '同事犯了个错导致项目延期，领导批评了全组，会后你会？',
    poleA: '找同事复盘问题，讨论怎么改进流程', poleB: '先安慰同事，他现在肯定很难受',
    weightA: 'left',
  },
  {
    id: 33, dimension: 'TF',
    text: '朋友圈看到好友发了条很丧的动态，你会？',
    poleA: '分析问题出在哪，给一个实际建议', poleB: '立刻私聊安慰，陪伴比解决问题重要',
    weightA: 'left',
  },
  {
    id: 34, dimension: 'TF',
    text: '做一个涉及他人的决定时，你更看重？',
    poleA: '逻辑上说得通，对事不对人', poleB: '大家的感受，不想让任何人难过',
    weightA: 'left',
  },
  {
    id: 35, dimension: 'TF',
    text: '和朋友产生分歧，你更倾向于？',
    poleA: '摆事实讲道理，谁有理听谁的', poleB: '维护关系更重要，找个折中点',
    weightA: 'left',
  },
  {
    id: 36, dimension: 'TF',
    text: '别人向你倾诉烦恼，你通常？',
    poleA: '帮他分析问题，给出解决方案', poleB: '先共情和倾听，让他知道你在',
    weightA: 'left',
  },
  {
    id: 37, dimension: 'TF',
    text: '你觉得"公平"更意味着？',
    poleA: '一视同仁，按规则办事', poleB: '考虑每个人的具体情况，因人而异',
    weightA: 'left',
  },
  {
    id: 38, dimension: 'TF',
    text: '收到批评时，你的第一反应？',
    poleA: '先想想批评得有没有道理', poleB: '先有点受伤，然后才慢慢消化',
    weightA: 'left',
  },
  {
    id: 39, dimension: 'TF',
    text: '选餐厅请朋友吃饭，你更看重？',
    poleA: '评分高、菜品好、性价比合适', poleB: '氛围好、朋友会喜欢的风格',
    weightA: 'left',
  },
  {
    id: 40, dimension: 'TF',
    text: '你更认同哪句话？',
    poleA: '"对事不对人，实话最重要"', poleB: '"说话要顾及别人的感受"',
    weightA: 'left',
  },
  {
    id: 41, dimension: 'TF',
    text: '和朋友AA制吃饭，结账时差了几块钱，你会？',
    poleA: '精确算清楚，差多少补多少', poleB: '算了算了，几块钱无所谓',
    weightA: 'left',
  },
  {
    id: 42, dimension: 'TF',
    text: '你看电影容易？',
    poleA: '关注剧情逻辑和设定合理性', poleB: '被角色的情感打动，跟着一起哭一起笑',
    weightA: 'left',
  },

  // ===== JP维度 (id 43-56) =====
  {
    id: 43, dimension: 'JP',
    text: '十一长假快到了，你会怎么安排？',
    poleA: '提前订好机票酒店，做了攻略表', poleB: '大概想个方向，到了再看，随机应变',
    weightA: 'left',
  },
  {
    id: 44, dimension: 'JP',
    text: '你的桌面/房间通常是什么状态？',
    poleA: '定期整理，东西都有固定位置', poleB: '有点乱但总能找到，偶尔心血来潮整理',
    weightA: 'left',
  },
  {
    id: 45, dimension: 'JP',
    text: 'deadline是下周五，你现在的状态？',
    poleA: '这周就开始做，提前完成才安心', poleB: '下周再开始吧，deadline前一晚灵感最给力',
    weightA: 'left',
  },
  {
    id: 46, dimension: 'JP',
    text: '约了朋友周六下午两点，他临时改到四点，你心里？',
    poleA: '有点不舒服，计划被打乱了', poleB: '完全OK，多出两小时还能做别的',
    weightA: 'left',
  },
  {
    id: 47, dimension: 'JP',
    text: '你去超市买东西，购物方式是？',
    poleA: '提前列清单，直奔目标，买完就走', poleB: '随便逛逛，经常买计划外的东西',
    weightA: 'left',
  },
  {
    id: 48, dimension: 'JP',
    text: '理想的工作模式？',
    poleA: '有明确目标和时间节点，按部就班推进', poleB: '自由灵活，灵感来了猛干，状态不好就休息',
    weightA: 'left',
  },
  {
    id: 49, dimension: 'JP',
    text: '旅行风格更接近哪种？',
    poleA: '每天行程提前规划好，按计划执行', poleB: '到了随心情逛，走到哪算哪',
    weightA: 'left',
  },
  {
    id: 50, dimension: 'JP',
    text: '你更喜欢哪种周末？',
    poleA: '安排得满满当当，充实有效率', poleB: '没有计划，睡到自然醒，想干嘛干嘛',
    weightA: 'left',
  },
  {
    id: 51, dimension: 'JP',
    text: '做一件事之前，你通常会？',
    poleA: '先制定详细的计划再动手', poleB: '先开始做，边做边调整',
    weightA: 'left',
  },
  {
    id: 52, dimension: 'JP',
    text: '你对"变化"的态度？',
    poleA: '不太喜欢意外，稳定可控才安心', poleB: '挺喜欢变化的，新鲜感让生活有趣',
    weightA: 'left',
  },
  {
    id: 53, dimension: 'JP',
    text: '你的日常安排更像？',
    poleA: '比较固定，有规律地作息和生活', poleB: '很灵活，每天可能都不一样',
    weightA: 'left',
  },
  {
    id: 54, dimension: 'JP',
    text: '面对多个任务时，你倾向于？',
    poleA: '列清单排优先级，一个一个来', poleB: '同时推进，哪个有灵感先做哪个',
    weightA: 'left',
  },
  {
    id: 55, dimension: 'JP',
    text: '你觉得"完美"的标准是？',
    poleA: '按计划高质量完成，不遗漏细节', poleB: '差不多就行，完成比完美重要',
    weightA: 'left',
  },
  {
    id: 56, dimension: 'JP',
    text: '你收拾行李的方式？',
    poleA: '提前列清单，按类别叠好装好', poleB: '出发前一晚随手塞进去，差不多就行',
    weightA: 'left',
  },
];

/**
 * 从题库中为每个维度随机抽取指定数量的题目
 * 使用 seed 来保证同一用户看到的题目顺序一致
 */
export function pickRandomQuestions(seed?: number): Question[] {
  const dims: ('EI' | 'SN' | 'TF' | 'JP')[] = ['EI', 'SN', 'TF', 'JP'];
  const picked: Question[] = [];

  // Simple seeded random
  let s = seed || Date.now();
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (const dim of dims) {
    const pool = freeQuestions.filter(q => q.dimension === dim);
    // Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    picked.push(...shuffled.slice(0, QUESTIONS_PER_DIM));
  }

  // Shuffle the final 28 questions
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }

  return picked;
}
