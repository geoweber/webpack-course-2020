async function start() {
	return await Promise.resolve('Async working');
}
start().then(console.log);

class Util {
	static id = Date.now();
}

const unused = 42;

console.log('Util.id ', Util.id);

// lazy load
import('lodash').then((_) => {
	console.log('lodash', _.random(0, 42, true));
});
