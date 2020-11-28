/*
 * Fetch file from url and but the promise is
 * rejected if response status is not ok
 */
export async function loadFile(url) {
	const response = await fetch(url);
	if(response.ok)
		return response;
	throw new Error(response.url + " " + response.status + " (" + response.statusText + ")");
}
