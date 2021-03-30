import { formatISO, parseISO } from "date-fns"

const dateRegex = /^[0-9]{4}(-[0-9]{2}){2}T[0-9]{2}(:[0-9]{2}){2}/
export function hydrate <T extends unknown>(obj: T): T
export function hydrate (obj: unknown): unknown {
	if (Array.isArray(obj)) return obj.map(hydrate)
	if (typeof obj !== 'object') return obj
	if (!obj) return obj

	return Object.entries(obj).reduce((hsh, [k, v]) => ({
		...hsh,
		[k]: obj.constructor.name === 'object'
			? hydrate(v)
			: typeof v === 'string' && dateRegex.exec(v)
				? parseISO(v)
				: v
	}), {})
}

const replacer = (_: string, val: unknown) => {
	if (val instanceof Date) return formatISO(val)
	return val
}

export const dehydrate = (obj: unknown): string => {
	return JSON.stringify(obj, replacer)
}
