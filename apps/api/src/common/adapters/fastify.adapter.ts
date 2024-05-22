import fastifyCookie from '@fastify/cookie'
import FastifyMultipart from '@fastify/multipart'
import { Logger } from '@nestjs/common'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { getIp } from '../../utils/ip.util';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
})
export { app as fastifyApp }
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.register(FastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6, // Limit size 6MB
    files: 5, // Max number of file fields
  },
})

app.getInstance().addHook('onRequest', (request, reply, done) => {
  // Set undefined origin
  const origin = request.headers.origin
  if (!origin) {
    request.headers.origin = request.headers.host
  }

  // Forbidden PHP

  const url = request.url
  const ua = request.raw.headers['user-agent']
  if (url.endsWith('.php')) {
    reply.raw.statusMessage =
      'Eh. PHP is not supported on this machine. Yep, I also DONT think PHP is the best programming language. So go away nerd.'
    logWarn('PHP is the best programming language in the world!!!!!!!', request, 'GodPHP')

    return reply.code(418).send()
  } else if (url.match(/\/(adminer|admin|wp-login|phpMyAdmin|\.env)$/gi)) {
    const isMxSpaceClient = ua?.match('mx-space')
    reply.raw.statusMessage = 'Hey, what the heck are you doing!'
    reply.raw.statusCode = isMxSpaceClient ? 666 : 200
    logWarn(
      'Attention, someone is attempting a penetration test. Let me see who it is, which naughty person is being so disobedient.\n',
      request,
      'Security',
    )

    return reply.send('Check request header to find an egg.')
  }

  // Skip favicon request
  if (url.match(/favicon\.ico$/) || url.match(/manifest\.json$/)) {
    return reply.code(204).send()
  }

  done()
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.register(fastifyCookie, {
  secret: 'cookie-secret', // This secret is not very important, it does not store authentication related info, so it doesn't matter
})

const logWarn = (desc: string, req: any, context: string) => {
  const ua = req.raw.headers['user-agent']
  Logger.warn(
    // prettier-ignore
    `${desc}\n` +
    `Path: ${req.url}\n` +
    `IP: ${getIp(req)}\n` +
    `UA: ${ua}`,
    context,
  )
}
