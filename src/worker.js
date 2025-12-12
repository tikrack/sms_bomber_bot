const TELEGRAM_BOT_TOKEN = '8309141293:AAHtu6KB0cSd7dYzfCW2m5OnngWQyMHbkqQ';

async function sendMessage(chatId, text) {
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
	const body = {
		chat_id: chatId, text: text, parse_mode: 'HTML'
	};

	return await fetch(url, {
		method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
	});
}

export default {
	async fetch(request) {
		// if (request.method !== 'POST') {
		// 	return new Response('Not Found', { status: 404 });
		// }

		// const res = await request.json();

		await sendMessage("hi")

		return new Response('OK');
	}
};
