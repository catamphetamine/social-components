import twoChannel from './services/2ch.js'
import fourChannel from './services/4chan.js'
import arhivach from './services/arhivach.js'
import discord from './services/discord.js'
import facebook from './services/facebook.js'
import github from './services/github.js'
import gitlab from './services/gitlab.js'
import google from './services/google.js'
import instagram from './services/instagram.js'
import reddit from './services/reddit.js'
import soundcloud from './services/soundcloud.js'
import steam from './services/steam.js'
import telegram from './services/telegram.js'
import twitch from './services/twitch.js'
import twitter from './services/twitter.js'
import vimeo from './services/vimeo.js'
import vk from './services/vk.js'
import wikipedia from './services/wikipedia.js'
import yandex from './services/yandex.js'
import youtube from './services/youtube.js'

const SERVICE_PROVIDERS = [
	twoChannel,
	fourChannel,
	arhivach,
	discord,
	facebook,
	github,
	gitlab,
	google,
	instagram,
	reddit,
	soundcloud,
	steam,
	telegram,
	twitch,
	twitter,
	vimeo,
	vk,
	wikipedia,
	yandex,
	youtube
]

const SERVICES_BY_DOMAIN = {}
const SERVICE_DOMAIN_REG_EXPS = []

for (const serviceProvider of SERVICE_PROVIDERS) {
	for (const service of serviceProvider.services) {
		for (const domain of service.domains) {
			if (typeof domain === 'string') {
				SERVICES_BY_DOMAIN[domain] = {
					provider: serviceProvider.name,
					getLinkTitle: service.getLinkTitle
				}
			} else if (domain instanceof RegExp) {
				SERVICE_DOMAIN_REG_EXPS.push({
					domainRegExp: domain,
					provider: serviceProvider.name,
					getLinkTitle: service.getLinkTitle
				})
			}
		}
	}
}

export default function getServiceByDomain(domain) {
	const serviceByDomain = SERVICES_BY_DOMAIN[domain]
	if (serviceByDomain) {
		return serviceByDomain
	}
	for (const serviceDomainRegExp of SERVICE_DOMAIN_REG_EXPS) {
		if (serviceDomainRegExp.domainRegExp.test(domain)) {
			return {
				provider: serviceDomainRegExp.provider,
				getLinkTitle: serviceDomainRegExp.getLinkTitle
			}
		}
	}
}