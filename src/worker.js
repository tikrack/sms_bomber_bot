export default {
  async fetch(request, env, ctx) {
		const response = await env.TikiAi.run(
			"@cf/meta/llama-3.1-8b-instruct",
			{
				prompt: "What is the origin of the phrase Hello, World",
			}
		);

    return new Response(JSON.stringify(response));
  }
};
