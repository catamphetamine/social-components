import findContentPart from './findContentPart.js'
import splitContent from './splitContent.js'
import getContentBlocks from './getContentBlocks.js'

/**
 * Splits `content` into content blocks where there're two or more `\n` characters.
 * @param  {any} content
 * @return {any} A copy of `content` with newContentBlocks split.
 */
export default function splitContentIntoBlocksByMultipleLineBreaks(content) {
	const originalContent = content
	content = getContentBlocks(content)

	// `newContentBlocks` is "lazily" initialized, i.e. it doesn't get initialized
	// until there's an actual split point found.
	let newContentBlocks

	let i = 0
	while (i < content.length) {
		let splitResult
		if (Array.isArray(content[i])) {
			splitResult = splitParagraph(content[i])
		}
		if (Array.isArray(splitResult)) {
			// Initializing `newContentBlocks` on demand is a minor optimization
			// for cases when newContentBlocks likely won't be split.
			if (!newContentBlocks) {
				newContentBlocks = content.slice(0, i)
			}
			newContentBlocks = newContentBlocks.concat(splitResult)
		} else {
			// Initializing `newContentBlocks` on demand is a minor optimization
			// for cases when newContentBlocks likely won't be split.
			if (newContentBlocks) {
				newContentBlocks.push(content[i])
			}
		}
		i++
	}

	// If no split point was found, returns the original `content`.
	return newContentBlocks || originalContent
}

const WHITESPACE = /^\s+$/

function findParagraphSplit(content) {
	let skip
	const indexes = findContentPart(content, (part, { getNextPart }) => {
		if (part === '\n') {
			skip = 1
			let nextPart
			let splitPointFound
			while ((nextPart = getNextPart(skip)) !== undefined) {
				if (nextPart === '\n') {
					if (!splitPointFound) {
						splitPointFound = true
					}
				}
				if (!WHITESPACE.test(nextPart)) {
					skip--
					return splitPointFound
				}
				skip++
			}
			if (splitPointFound) {
				skip--
				return true
			}
		}
	})
	if (indexes) {
		return {
			indexes,
			skip
		}
	}
}

function splitParagraph(content) {
	const splitPoint = findParagraphSplit(content)
	if (!splitPoint) {
		return
	}
	const { indexes, skip } = splitPoint
	const [one, two] = splitContent(content, indexes, { skip, include: false })
	// If `content` is `["\n", "\n"]` then both
	// `one` and `two` will be `undefined`.
	if (!one && !two) {
		return
	}
	if (!one) {
		return splitParagraph(two) || [two]
	}
	if (!two) {
		return [one]
	}
	const furtherSplit = splitParagraph(two)
	if (furtherSplit) {
		return [
			one,
			...furtherSplit
		]
	}
	return [one, two]
}