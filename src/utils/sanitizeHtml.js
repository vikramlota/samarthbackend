const sanitizeHtmlLib = require('sanitize-html');

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark',
  'a', 'img',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
  'iframe',
];

const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'style', 'id'],
  'a': ['href', 'target', 'rel', 'title'],
  'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
  'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
  'th': ['colspan', 'rowspan'],
  'td': ['colspan', 'rowspan'],
};

const ALLOWED_IFRAME_HOSTNAMES = [
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'player.vimeo.com',
];

function sanitizeHtml(dirty) {
  if (!dirty) return '';

  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,

    transformTags: {
      'a': (tagName, attribs) => {
        if (attribs.href && /^https?:\/\//i.test(attribs.href)) {
          if (!attribs.target) attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      },
      'img': (tagName, attribs) => {
        if (!attribs.loading) attribs.loading = 'lazy';
        return { tagName, attribs };
      },
    },
  });
}

module.exports = { sanitizeHtml };
