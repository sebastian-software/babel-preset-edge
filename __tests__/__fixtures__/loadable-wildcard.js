import loadable from '@loadable/component'

const page = "About"
const lang = "de_DE"

export const views = loadable(() => import(`./views/${page}`))
export const leanIntlData = loadable(() => import(`./lean-intl/locale-data/${lang}`))
export const reactIntlData = loadable(() => import(`./react-intl/locale-data/${lang}`))
