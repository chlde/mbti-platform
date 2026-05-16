export interface MBTIResult {
  type: string;
  scores: {
    EI: number; // percentage 0-100, where 0=E, 100=I
    SN: number; // percentage 0-100, where 0=S, 100=N
    TF: number; // percentage 0-100, where 0=T, 100=F
    JP: number; // percentage 0-100, where 0=J, 100=P
  };
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface Report {
  type: string;
  sections: ReportSection[];
  generatedAt: string;
}

/**
 * Given dimension score (0–100), returns a human-readable Chinese description
 * of where the user falls on that spectrum, noting proximity to the middle.
 */
function describeDimension(
  lowLabel: string,
  highLabel: string,
  score: number
): string {
  const lowPct = 100 - score;
  const highPct = score;

  if (score <= 40) {
    return `明确的${lowLabel}倾向（${lowLabel} ${lowPct}% / ${highLabel} ${highPct}%）`;
  }
  if (score >= 60) {
    return `明确的${highLabel}倾向（${lowLabel} ${lowPct}% / ${highLabel} ${highPct}%）`;
  }
  // 41–59: near middle
  return `接近中间地带，略偏${score >= 50 ? highLabel : lowLabel}（${lowLabel} ${lowPct}% / ${highLabel} ${highPct}%）。这意味着此人在该维度上具有较高的灵活性，可以根据情境切换偏好`;
}

/**
 * Generates the full Chinese prompt that will be sent to the LLM to produce
 * a ~5000-character MBTI personality analysis report.
 */
export function generateReportPrompt(result: MBTIResult): string {
  const { type, scores } = result;

  const eiDesc = describeDimension("外向(E)", "内向(I)", scores.EI);
  const snDesc = describeDimension("感觉(S)", "直觉(N)", scores.SN);
  const tfDesc = describeDimension("思维(T)", "情感(F)", scores.TF);
  const jpDesc = describeDimension("判断(J)", "知觉(P)", scores.JP);

  // Identify near-middle dimensions for extra personalisation hints
  const nearMiddle: string[] = [];
  if (scores.EI > 40 && scores.EI < 60) nearMiddle.push("EI（外向-内向）");
  if (scores.SN > 40 && scores.SN < 60) nearMiddle.push("SN（感觉-直觉）");
  if (scores.TF > 40 && scores.TF < 60) nearMiddle.push("TF（思维-情感）");
  if (scores.JP > 40 && scores.JP < 60) nearMiddle.push("JP（判断-知觉）");

  const nearMiddleNote =
    nearMiddle.length > 0
      ? `\n\n⚠️ 特别注意：该用户在 ${nearMiddle.join("、")} 维度上接近中间值。请在分析中明确指出这种灵活性带来的优势和潜在内心冲突，不要将其简单归类到某一端。`
      : "";

  const prompt = `你是一位经验丰富的 MBTI 性格分析专家，同时也是一位温暖但坦诚的朋友。现在请根据以下信息，为用户生成一份深度个性化 MBTI 性格分析报告。

━━━━━━━━━━━━━━━━━━━━━━
📋 用户测试结果
━━━━━━━━━━━━━━━━━━━━━━
- MBTI 类型：${type}
- EI 维度（外向 ← → 内向）：${eiDesc}
- SN 维度（感觉 ← → 直觉）：${snDesc}
- TF 维度（思维 ← → 情感）：${tfDesc}
- JP 维度（判断 ← → 知觉）：${jpDesc}${nearMiddleNote}

━━━━━━━━━━━━━━━━━━━━━━
📝 写作风格要求
━━━━━━━━━━━━━━━━━━━━━━
1. **语气**：温暖但专业，像一位既了解心理学又关心用户成长的朋友。避免过于学术或冰冷的措辞。
2. **真实坦诚**：不要一味赞美。指出真实的盲区、潜在风险和需要警惕的性格陷阱。好的朋友不会只说好话。
3. **具体可操作**：每个模块至少给出 3 条具体、可执行的建议，避免"多注意休息"这类泛泛而谈的内容。
4. **个性化**：紧密围绕用户的维度得分进行分析，尤其是接近中间值的维度要特别说明其双面性。不要写成可以套用于任何人的通用描述。
5. **深度**：透过表面行为挖掘背后的心理动机，帮助用户理解"为什么我会这样"。

━━━━━━━━━━━━━━━━━━━━━━
📊 报告结构（共 5 个模块）
━━━━━━━━━━━━━━━━━━━━━━

请严格按照以下 5 个模块撰写，每个模块约 800 字（中文字符），总计约 4000-5000 字。

### 模块 1：性格画像（Personality Portrait）
- 核心性格特征的生动描绘
- 四个维度如何交互形成独特的性格组合
- 与常见刻板印象的对比（指出哪些刻板印象是错的）
- 内在心理动力：什么驱动这个人，什么消耗这个人的能量
- 一个概括性的"性格关键词"总结

### 模块 2：职业指南（Career Guide）
- 最适合的职业领域和具体岗位（至少列举 5 个具体职位）
- 应该避开的职业类型及原因
- 工作风格分析：团队合作 vs 独立工作、领导力风格
- 职场中的人际互动建议
- 职业发展中可能遇到的瓶颈及突破策略

### 模块 3：恋爱与关系（Love & Relationships）
- 恋爱中的行为模式和情感需求
- 与不同 MBTI 类型的兼容性分析（最佳搭配、需努力的搭配）
- 沟通方式以及在亲密关系中容易出现的误解
- 表达爱的方式和期望被爱的方式
- 维系长期关系的建议和需要注意的雷区

### 模块 4：个人成长（Personal Growth）
- 当前性格的最大优势和如何进一步发挥
- 最需要关注的发展领域（盲区）
- 具体的成长行动计划（短期、中期、长期各 1-2 条）
- 推荐的学习方式和自我提升资源类型
- 压力反应模式及健康的压力管理建议

### 模块 5：社交风格（Social Style）
- 典型的社交行为模式
- 在不同社交场景中的表现（大型聚会、小型聚会、一对一）
- 建立和维护友谊的方式
- 社交中的优势和可能的社交陷阱
- 提升社交质量的具体建议

━━━━━━━━━━━━━━━━━━━━━━
📤 输出格式要求（严格遵守）
━━━━━━━━━━━━━━━━━━━━━━

你必须且只能输出一个合法的 JSON 对象，不要输出任何 JSON 以外的内容（不要 markdown 代码块标记、不要额外说明文字）。

JSON 结构如下：

{
  "type": "${type}",
  "sections": [
    {
      "title": "性格画像",
      "content": "（约 800 字的性格画像分析内容）"
    },
    {
      "title": "职业指南",
      "content": "（约 800 字的职业指南分析内容）"
    },
    {
      "title": "恋爱与关系",
      "content": "（约 800 字的恋爱与关系分析内容）"
    },
    {
      "title": "个人成长",
      "content": "（约 800 字的个人成长分析内容）"
    },
    {
      "title": "社交风格",
      "content": "（约 800 字的社交风格分析内容）"
    }
  ],
  "generatedAt": "ISO 8601 格式的时间戳"
}

关键提醒：
- sections 数组必须恰好包含 5 个元素，顺序如上
- 每个 section 的 title 必须与上面完全一致
- content 字段中使用 \\n 表示换行，不要使用 <br> 或其他 HTML 标签
- content 中可以使用中文标点的顿号、书名号等，但不要使用 Markdown 格式（如 **加粗**、## 标题等）
- generatedAt 使用当前 UTC 时间的 ISO 8601 格式
- 确保 JSON 合法可解析，特别注意引号转义

现在请开始生成报告。`;

  return prompt;
}
