import type { ReactNode } from 'react';

/**
 * Safely parses detail content with basic HTML-like markup into React elements.
 * This avoids XSS vulnerabilities by explicitly handling only known safe patterns.
 * 
 * Supported markup:
 * - <strong>text</strong> -> <strong>text</strong>
 * - \n -> <br />
 * - • bullet points -> preserved as text
 * 
 * @param content - The detail string with markup
 * @returns Array of React nodes
 */
export function parseDetailContent(content: string): ReactNode[] {
  const result: ReactNode[] = [];
  let key = 0;

  // Split by newlines first to handle line breaks
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      result.push(<br key={`br-${key++}`} />);
    }

    if (!line) {
      return; // Empty line
    }

    // Parse <strong> tags within the line
    const parts: ReactNode[] = [];
    let currentIndex = 0;
    const strongRegex = /<strong>(.*?)<\/strong>/g;
    let match;

    while ((match = strongRegex.exec(line)) !== null) {
      // Add text before the <strong> tag
      if (match.index > currentIndex) {
        parts.push(line.substring(currentIndex, match.index));
      }

      // Add the <strong> content
      parts.push(<strong key={`strong-${key++}`}>{match[1]}</strong>);

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text after last <strong> tag
    if (currentIndex < line.length) {
      parts.push(line.substring(currentIndex));
    }

    // If we found any parts, add them; otherwise add the whole line
    if (parts.length > 0) {
      parts.forEach((part) => result.push(part));
    } else {
      result.push(line);
    }
  });

  return result;
}
