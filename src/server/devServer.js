import {setupWorker} from "msw"
import {homepage} from "../../../package.json"
import {handlers} from "./serverHandlers"

const fullUrl = new URL(homepage)

const server = setupWorker(...handlers)

server.start({
  quiet: true,
  serviceWorker: {
    url: fullUrl.pathname + "mockServiceWorker.js",
  },
})

export * from "msw"
export {server}
