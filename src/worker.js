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
				from: { username, first_name },
				chat: { id, type },
			},
		} = await request.json();

		if (type !== 'private') {
			await sendMessage(
				id,
				`سلام سلام ${first_name} 😎✨
می‌دونم که می‌خوای استفاده کنی، ولی 😅 نمی‌تونی بدون حضور من!
باید بیای شخصی 🤝 تا بتونی بهره‌مند شی 🎉
نه توی گروه، نه چنل، نه جای دیگه! فقط شخصی 😇🪻
بخدا شرمندم، ولی اینم راهشه 😉🤗`,
			);
			return;
		}

		if (!ALLOWED_USERNAMES.includes(username)) {
			await sendMessage(
				id,
				`درود ${first_name} عزیز ✨
متاسفانه شما اجازه استفاده از ربات را ندارید! 🌹`,
			);
			return;
		}

		const pattern = /^\[Send\]\n(09\d{9})\n(\d+)$/;

		if (!pattern.test(text)) {
			await sendMessage(
				id,
				`🔥 لطفاً شماره مورد نظر رو <b>دقیقاً</b> در ساختار زیر ارسال کن
⚠️ <b>حتماً همین فرمت را رعایت کن!</b>
(👇 با کلیک روی باکس، متن خودکار کپی می‌شود)

<b>ساختار صحیح:</b>

<pre><code>[Send]
09991112233
10</code></pre>

⚡ پارامتر اول = شماره
⚡ پارامتر دوم = تعداد دفعات حمله`,
			);
		}else {
			await sendMessage(id, "حمله شروع شد")
		}

		return new Response('OK');
	},
};
