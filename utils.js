export async function loadFile(url) {
	const response = await fetch(url);
	if(response.ok)
		return response;
	throw new Error(response.url + " " + response.status + " (" + response.statusText + ")");
}
