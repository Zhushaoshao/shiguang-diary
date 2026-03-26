/**
 * 日期时间解析工具
 * 支持多种格式的日期时间识别
 */

export interface ParsedDateTime {
  date: Date;
  hasDate: boolean;
  hasTime: boolean;
  originalText: string;
  matchIndex: number;
  matchLength: number;
}

/**
 * 解析文本中的日期时间
 * 支持格式：
 * - 2026年03月26日 08:26:45
 * - 2026-3-26 08:26:45
 * - 2026/3/26 08:26
 * - 2026.3.26 8:26
 * - 2026年3月26 8:26
 * - 2026-03-26
 * - 03-26
 * - 8:26 / 08:26:45
 */
export function parseDateTimeFromText(text: string): ParsedDateTime[] {
  const results: ParsedDateTime[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();

  // 日期时间正则（宽松匹配）
  const patterns = [
    // 完整日期 + 时间
    /(\d{4})[\s年\-\/\.]+(\d{1,2})[\s月\-\/\.]+(\d{1,2})[\s日号]?\s*(\d{1,2})[\s:：]+(\d{1,2})(?:[\s:：]+(\d{1,2}))?/g,
    // 只有日期（年月日）
    /(\d{4})[\s年\-\/\.]+(\d{1,2})[\s月\-\/\.]+(\d{1,2})[\s日号]?/g,
    // 只有月日
    /(\d{1,2})[\s月\-\/\.]+(\d{1,2})[\s日号]?/g,
    // 只有时间
    /(\d{1,2})[\s:：]+(\d{1,2})(?:[\s:：]+(\d{1,2}))?/g,
  ];

  let lastDate: Date | null = null;
  const matchedRanges: Array<{ start: number; end: number }> = [];

  const isOverlapping = (start: number, end: number) =>
    matchedRanges.some((range) => start < range.end && end > range.start);

  const addRange = (start: number, end: number) => {
    matchedRanges.push({ start, end });
  };

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;
      const matchEnd = matchIndex + matchText.length;

      if (isOverlapping(matchIndex, matchEnd)) {
        continue;
      }

      let year = currentYear;
      let month = 1;
      let day = 1;
      let hour = 0;
      let minute = 0;
      let second = 0;
      let hasDate = false;
      let hasTime = false;

      // 判断匹配类型
      if (match[1] && match[2] && match[3]) {
        // 有年月日
        if (match[1].length === 4) {
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
          hasDate = true;

          if (match[4] && match[5]) {
            hour = parseInt(match[4]);
            minute = parseInt(match[5]);
            second = match[6] ? parseInt(match[6]) : 0;
            hasTime = true;
          }
        } else if (match[1].length <= 2 && match[2]) {
          // 只有月日
          month = parseInt(match[1]);
          day = parseInt(match[2]);
          hasDate = true;
        }
      } else if (match[1] && match[2]) {
        // 只有时间
        hour = parseInt(match[1]);
        minute = parseInt(match[2]);
        second = match[3] ? parseInt(match[3]) : 0;
        hasTime = true;

        // 如果之前有日期，使用之前的日期
        if (lastDate) {
          year = lastDate.getFullYear();
          month = lastDate.getMonth() + 1;
          day = lastDate.getDate();
          hasDate = true;
        }
      }

      // 验证日期有效性
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        continue;
      }

      // 验证时间有效性
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        continue;
      }

      const date = new Date(year, month - 1, day, hour, minute, second);

      // 如果有日期，更新 lastDate
      if (hasDate) {
        lastDate = date;
      }

      addRange(matchIndex, matchEnd);

      results.push({
        date,
        hasDate,
        hasTime,
        originalText: matchText,
        matchIndex,
        matchLength: matchText.length,
      });
    }
  }

  // 按位置排序
  results.sort((a, b) => a.matchIndex - b.matchIndex);

  return results;
}

/**
 * 根据日期时间拆分文本为多篇日记
 */
export interface DiaryEntry {
  title: string;
  content: string;
  date: Date;
}

export function splitTextIntoDiaries(text: string): DiaryEntry[] {
  const parsedDates = parseDateTimeFromText(text);

  // 如果没有找到任何日期，整篇作为一篇日记
  if (parsedDates.length === 0) {
    return [
      {
        title: formatDateTitle(new Date()),
        content: text.trim(),
        date: new Date(),
      },
    ];
  }

  const diaries: DiaryEntry[] = [];
  let lastIndex = 0;

  parsedDates.forEach((parsed, index) => {
    // 只在有日期的地方拆分
    if (parsed.hasDate) {
      // 提取上一段内容
      if (index > 0 || parsed.matchIndex > 0) {
        const prevContent = text.substring(lastIndex, parsed.matchIndex).trim();
        if (prevContent) {
          // 如果有上一段内容，使用上一个日期或当前日期
          const prevDate = index > 0 ? parsedDates[index - 1].date : new Date();
          diaries.push({
            title: formatDateTitle(prevDate),
            content: prevContent,
            date: prevDate,
          });
        }
      }

      lastIndex = parsed.matchIndex + parsed.matchLength;
    }
  });

  // 处理最后一段
  const lastContent = text.substring(lastIndex).trim();
  if (lastContent) {
    const lastDate = parsedDates[parsedDates.length - 1].date;
    diaries.push({
      title: formatDateTitle(lastDate),
      content: lastContent,
      date: lastDate,
    });
  }

  return diaries;
}

/**
 * 格式化日期为标题
 */
function formatDateTitle(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} 日记`;
}

