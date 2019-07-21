module.exports = {
	shuffle: array => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	},
	wrapText: (context, text, x, y, maxWidth, lineHeight) => {
		let words = text.split(' ');
		let line = '';
		let lineCount = 0;

		for(let n = 0; n < words.length; n++) {
			let testLine = line + words[n] + ' ';
			let metrics = context.measureText(testLine);
			let testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				lineCount++;
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}

		context.fillText(line, x, y);

		return lineCount;
	}
}
