import config from '../data/config';

function talk(talk) {
	return `<a class="talk-box" ${talk.url ? 'href="' + talk.url + '"' : ''} target="_blank">
			<img src="/images${talk.image}">
			<span class="talk-box__title">${talk.name}</span>
			<span class="talk-box__conference">${talk.event}</span>
			<span class="talk-box__date">${talk.date}</span>
		</a>`;
}

function talkboxes(talks) {
	return talks.map(t => {
		return talk(t);
	}).join('');
}

export function talks() {
	const talks = config().talks;
	let html = `<h2>Upcoming Talks/Workshops</h2><p>`;
	if (talks.upcoming) {
		html += talkboxes(talks.upcoming);
	} else {
		html += `<p>Currently none.</p>`;
	}
	html += `</p><h2>Past Talks/Workshops</h2><p>`;
	if (talks.past) {
		html += talkboxes(talks.past);
	} else {
		html += `<p>Currently none.</p>`;
	}
	html += `</p>`;
	return html;
}

export function warning(text) {
	return `<p class="warning">${text}</p>`;
}

export function hintbox(text) {
	return `<div class="hintbox">${text}</div>`;
}
