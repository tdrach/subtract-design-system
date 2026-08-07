// @ts-nocheck
// Layer-A runtime entry for design-sync: pull global base styles + tokens
// (:root custom properties, body/heading/focus) so they land in dist/index.css,
// then re-export every component. SCSS modules compile to css-modules here.
import '../../src/styles/global.scss'
export * from '../../src/index'
