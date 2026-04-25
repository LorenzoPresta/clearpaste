import type { CleaningResult, RemovedCharDetail, AppSettings } from '../shared/types'

interface CharDefinition {
  pattern: RegExp
  name: string
  codePoint: string
  category: 'zeroWidth' | 'softHyphen' | 'directional' | 'invisibleMath' | 'nonBreaking'
}

const INVISIBLE_CHARS: CharDefinition[] = [
  // Zero-width characters
  { pattern: /\u200B/g, name: 'Zero-Width Space', codePoint: 'U+200B', category: 'zeroWidth' },
  { pattern: /\u200C/g, name: 'Zero-Width Non-Joiner', codePoint: 'U+200C', category: 'zeroWidth' },
  { pattern: /\u200D/g, name: 'Zero-Width Joiner', codePoint: 'U+200D', category: 'zeroWidth' },
  { pattern: /\uFEFF/g, name: 'Zero-Width No-Break Space (BOM)', codePoint: 'U+FEFF', category: 'zeroWidth' },
  { pattern: /\u2060/g, name: 'Word Joiner', codePoint: 'U+2060', category: 'zeroWidth' },
  { pattern: /\u034F/g, name: 'Combining Grapheme Joiner', codePoint: 'U+034F', category: 'zeroWidth' },

  // Soft hyphens
  { pattern: /\u00AD/g, name: 'Soft Hyphen', codePoint: 'U+00AD', category: 'softHyphen' },

  // Directional marks
  { pattern: /\u200E/g, name: 'Left-to-Right Mark', codePoint: 'U+200E', category: 'directional' },
  { pattern: /\u200F/g, name: 'Right-to-Left Mark', codePoint: 'U+200F', category: 'directional' },
  { pattern: /\u061C/g, name: 'Arabic Letter Mark', codePoint: 'U+061C', category: 'directional' },
  { pattern: /\u202A/g, name: 'Left-to-Right Embedding', codePoint: 'U+202A', category: 'directional' },
  { pattern: /\u202B/g, name: 'Right-to-Left Embedding', codePoint: 'U+202B', category: 'directional' },
  { pattern: /\u202C/g, name: 'Pop Directional Formatting', codePoint: 'U+202C', category: 'directional' },
  { pattern: /\u202D/g, name: 'Left-to-Right Override', codePoint: 'U+202D', category: 'directional' },
  { pattern: /\u202E/g, name: 'Right-to-Left Override', codePoint: 'U+202E', category: 'directional' },
  { pattern: /\u2066/g, name: 'Left-to-Right Isolate', codePoint: 'U+2066', category: 'directional' },
  { pattern: /\u2067/g, name: 'Right-to-Left Isolate', codePoint: 'U+2067', category: 'directional' },
  { pattern: /\u2068/g, name: 'First Strong Isolate', codePoint: 'U+2068', category: 'directional' },
  { pattern: /\u2069/g, name: 'Pop Directional Isolate', codePoint: 'U+2069', category: 'directional' },

  // Invisible math operators
  { pattern: /\u2061/g, name: 'Function Application', codePoint: 'U+2061', category: 'invisibleMath' },
  { pattern: /\u2062/g, name: 'Invisible Times', codePoint: 'U+2062', category: 'invisibleMath' },
  { pattern: /\u2063/g, name: 'Invisible Separator', codePoint: 'U+2063', category: 'invisibleMath' },
  { pattern: /\u2064/g, name: 'Invisible Plus', codePoint: 'U+2064', category: 'invisibleMath' },

  // Non-breaking space
  { pattern: /\u00A0/g, name: 'Non-Breaking Space', codePoint: 'U+00A0', category: 'nonBreaking' },
]

// Emoji ZWJ sequences use U+200D — we need to detect and preserve them
const EMOJI_ZWJ_PATTERN = /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\u200D/gu

function isPartOfEmojiSequence(text: string, index: number): boolean {
  // Check if the ZWJ at this index is part of an emoji sequence
  for (const match of text.matchAll(EMOJI_ZWJ_PATTERN)) {
    if (match.index !== undefined) {
      const zwjIndex = match.index + match[0].length - 1
      if (zwjIndex === index) return true
    }
  }
  return false
}

export function cleanText(text: string, settings: Partial<AppSettings> = {}): CleaningResult {
  const {
    removeZeroWidth = true,
    removeSoftHyphens = true,
    removeDirectionalMarks = true,
    removeInvisibleMath = true,
    normalizeNonBreakingSpaces = true,
    normalizeSmartQuotes = false,
    preserveEmojiZWJ = true
  } = settings

  let cleanedText = text
  const removedChars: RemovedCharDetail[] = []

  const categoryEnabled: Record<string, boolean> = {
    zeroWidth: removeZeroWidth,
    softHyphen: removeSoftHyphens,
    directional: removeDirectionalMarks,
    invisibleMath: removeInvisibleMath,
    nonBreaking: normalizeNonBreakingSpaces
  }

  for (const charDef of INVISIBLE_CHARS) {
    if (!categoryEnabled[charDef.category]) continue

    // Special handling for ZWJ (U+200D) — preserve in emoji sequences
    if (charDef.codePoint === 'U+200D' && preserveEmojiZWJ) {
      // Manual removal: skip ZWJs that are part of emoji sequences
      let result = ''
      let count = 0
      for (let i = 0; i < cleanedText.length; i++) {
        if (cleanedText[i] === '\u200D' && !isPartOfEmojiSequence(cleanedText, i)) {
          count++
        } else {
          result += cleanedText[i]
        }
      }
      if (count > 0) {
        cleanedText = result
        removedChars.push({
          char: charDef.codePoint,
          name: charDef.name,
          count,
          codePoint: charDef.codePoint
        })
      }
      continue
    }

    // For non-breaking spaces, replace with regular space instead of removing
    if (charDef.category === 'nonBreaking') {
      const matches = cleanedText.match(charDef.pattern)
      if (matches && matches.length > 0) {
        cleanedText = cleanedText.replace(charDef.pattern, ' ')
        removedChars.push({
          char: charDef.codePoint,
          name: charDef.name,
          count: matches.length,
          codePoint: charDef.codePoint
        })
      }
      continue
    }

    const matches = cleanedText.match(charDef.pattern)
    if (matches && matches.length > 0) {
      cleanedText = cleanedText.replace(charDef.pattern, '')
      removedChars.push({
        char: charDef.codePoint,
        name: charDef.name,
        count: matches.length,
        codePoint: charDef.codePoint
      })
    }
  }

  // Smart quote normalization
  if (normalizeSmartQuotes) {
    const smartQuotePairs: [RegExp, string, string][] = [
      [/\u201C/g, '"', 'Left Double Quotation Mark'],  // "
      [/\u201D/g, '"', 'Right Double Quotation Mark'], // "
      [/\u2018/g, "'", 'Left Single Quotation Mark'],  // '
      [/\u2019/g, "'", 'Right Single Quotation Mark'], // '
      [/\u2013/g, '-', 'En Dash'],                      // –
      [/\u2014/g, '--', 'Em Dash'],                      // —
      [/\u2026/g, '...', 'Horizontal Ellipsis'],         // …
    ]

    for (const [pattern, replacement, name] of smartQuotePairs) {
      const matches = cleanedText.match(pattern)
      if (matches && matches.length > 0) {
        cleanedText = cleanedText.replace(pattern, replacement)
        removedChars.push({
          char: name,
          name,
          count: matches.length,
          codePoint: name
        })
      }
    }
  }

  const totalRemoved = removedChars.reduce((sum, r) => sum + r.count, 0)

  return {
    cleanedText,
    originalText: text,
    charsRemoved: totalRemoved,
    removedChars
  }
}

export function hasInvisibleChars(text: string): boolean {
  const quickCheck = /[\u200B-\u200F\u00AD\uFEFF\u2060-\u2064\u034F\u061C\u202A-\u202E\u2066-\u2069\u00A0]/
  return quickCheck.test(text)
}
