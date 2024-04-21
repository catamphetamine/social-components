// Stupid Node.js can't even `import` JSON files.
// https://stackoverflow.com/questions/72348042/typeerror-err-unknown-file-extension-unknown-file-extension-json-for-node
// Using a `*.json.js` duplicate file workaround.

import fs from 'fs'

// Create `./messages/{language}.json.js` files.
for (const child of fs.readdirSync('./messages', { withFileTypes: true })) {
	if (child.isFile()) {
		const filename = child.name
		if (filename.match(/^[a-z]{2}\.json$/)) {
			const language = filename.slice(0, 2)
			const json = fs.readFileSync(`./messages/${language}.json`, 'utf8')
			fs.writeFileSync(`./messages/${language}.json.js`, 'export default ' + json, 'utf8')
		}
	}
}