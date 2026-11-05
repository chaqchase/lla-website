// The light counterpart to Vesper: neutral ink, with orange and green for the tokens that matter.
const ink = '#171717'
const soft = '#525252'
const faint = '#737373'
const orange = '#c2410c'
const leaf = '#15803d'

export const lightTheme = {
  name: 'lla-light',
  type: 'light',
  colors: { 'editor.background': '#00000000', 'editor.foreground': ink },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: faint } },
    { scope: ['string', 'string.quoted', 'markup.inline.raw'], settings: { foreground: leaf } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: orange } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control'], settings: { foreground: orange } },
    { scope: ['entity.name.function', 'support.function', 'entity.name.command'], settings: { foreground: ink, fontStyle: '' } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: ink } },
    { scope: ['entity.name.tag', 'support.type.property-name', 'entity.other.attribute-name'], settings: { foreground: orange } },
    { scope: ['variable', 'variable.other', 'variable.parameter'], settings: { foreground: ink } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: soft } },
    { scope: ['string.unquoted', 'meta.argument'], settings: { foreground: ink } }
  ]
}
