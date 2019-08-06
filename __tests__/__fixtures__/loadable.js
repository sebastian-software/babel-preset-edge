import loadable from "@loadable/component"

export const Home = loadable(() => import("./views/Home"))
export const About = loadable(() => import("./views/About"))
export const Contact = loadable(() => import("./views/Contact"))
