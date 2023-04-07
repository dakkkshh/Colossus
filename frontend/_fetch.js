export async function _fetch(url, obj = {}) {
	let headers = {};
	let { method = 'GET', body = undefined } = obj;

	if (body) {
		headers['Content-Type'] = 'application/json';
	}

	const options = {
		headers,
		body: JSON.stringify(body),
		method,
		credentials: 'include',
	};
	let res = await fetch(url, options);

	return res;
}