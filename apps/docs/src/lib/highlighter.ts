import { createHighlighter, type Highlighter } from 'shiki';

let _highlighter: Highlighter;
export async function getHighlighter() {
  if (!_highlighter) {
    _highlighter = await createHighlighter({
      themes: ['github-light-default'],
      langs: ['tsx', 'bash'],
    });
  }
  return _highlighter;
}
