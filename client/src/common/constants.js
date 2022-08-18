export const server = {
	dev: "localhost:3000",
	prod: "139.59.40.37:3000"
}

export const setServer = {
	server: "localhost:3000"
}

export var sleep = (milliseconds) => {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
		break;
		}
	}
}