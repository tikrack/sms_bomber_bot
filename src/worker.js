const TELEGRAM_BOT_TOKEN = '8309141293:AAHtu6KB0cSd7dYzfCW2m5OnngWQyMHbkqQ';

const ALLOWED_USERNAMES = ['tikrack'];

async function sendMessage(chatId, text) {
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
	const body = {
		chat_id: chatId,
		text: text,
		parse_mode: 'HTML',
	};

	return await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
}

export default {
	async fetch(request) {
		if (request.method !== 'POST') {
			return new Response('Not Found', { status: 404 });
		}

		const {
			message: {
				text,
				from: { username, first_name, last_name },
				chat: { id, type },
			},
		} = await request.json();

		if (type !== "private") {
			await sendMessage(id, `سلام سلام ${first_name} 😎✨
می‌دونم که می‌خوای استفاده کنی، ولی 😅 نمی‌تونی بدون حضور من!
باید بیای شخصی 🤝 تا بتونی بهره‌مند شی 🎉
نه توی گروه، نه چنل، نه جای دیگه! فقط شخصی 😇🪻
بخدا شرمندم، ولی اینم راهشه 😉🤗`);
		}

		return new Response('OK');
	},
};
