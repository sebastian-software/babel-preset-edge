import loadable from 'loadable-components'

const page = "About"
const lang = "de_DE"

export const views = loadable(() => import(`./views/${page}`))
export const leanIntl = loadable(() => import(`./lean-intl/${lang}/data`))
export const reactIntl = loadable(() => import(`./react-intl/${lang}/data`))
