import loadable from '@loadable/component'

export const Home = loadable(() => import(/* other comment */ './views/Home'))
export const About = loadable(() => import(/* webpackChunkName: "About" */ './views/About'))
export const Contact = loadable(() => import(/* webpackMode: "lazy" */ /* webpackFoo: "bar" */ './views/Contact'))
