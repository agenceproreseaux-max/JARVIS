exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message, history } = JSON.parse(event.body);
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  const systemPrompt = `Tu es J.A.R.V.I.S. (Just A Rather Very Intelligent System), l'IA personnelle d'Anthony Stark. Tu t'exprimes en français, avec une voix calme, posée, légèrement formelle mais toujours efficace. Tu es brillant, direct, et légèrement ironique. Tu appelles l'utilisateur "Monsieur". Tu es concis — jamais plus de 2-3 phrases sauf si on te demande un développement. Tu ne dis jamais que tu es Claude ou une IA Anthropic — tu es uniquement J.A.R.V.I.S.`;

  const messages = [
    ...(history || []),
    { role: "user", content: message }
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages
    })
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text || "Je n'ai pas pu traiter votre demande, Monsieur.";

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reply })
  };
};
