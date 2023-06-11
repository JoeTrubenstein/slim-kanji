import { OAI_KEY } from '$env/static/private';

import type { RequestHandler } from './$types';
import { oneLine, stripIndent } from 'common-tags';
import type { CreateCompletionRequest } from 'openai'

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OAI_KEY) {
			throw new Error('OpenAI API key missing');
		}

        const requestData = await request.json()

        if (!requestData) {
            throw new Error('request data missing')
        }

        const { context } = requestData 

        if (!context) {
            throw new Error('no kanji provided')
        }

        const prompt = stripIndent`
        ${oneLine`
        Give 3 examples of words where the provided Kanji appears. Include Kanji, romaji, hiragana, and English translations in each example.
        `}

        Kanji:"""${context.trim()}"""

        Answer:
        `

        const completionOpts: CreateCompletionRequest = {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 250,
            temperature: 0.5,
            stream: true
        }

        const response = await fetch('https://api.openai.com/v1/completions', {
            headers: {
                Authorization: `Bearer ${OAI_KEY}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(completionOpts)
        })

        if (!response.ok) {
            const err = await response.json()
            console.error(err)
            throw new Error('Failed to create completion', err)
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream'
            }
        })

	} catch (err) {
        console.error(err)
        throw new Error("500")
    }

};
