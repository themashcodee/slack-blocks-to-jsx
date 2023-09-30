import { ReactNode } from "react"
import parse, { HTMLReactParserOptions } from "html-react-parser"

const options: HTMLReactParserOptions = {
	trim: false,
}

// TODO: UPDATE THIS LATER TO SUPPORT ALL MARKDOWN
export const parseMrkdwn = (text: string): ReactNode => {
	if (!text) return null

	const pre = /```(.*?)```/g
	const code = /`(?!(?:[^<]*>|[^<>]*<\/pre>))([^`]*)`/g // code but ignore pre
	const bold = /\*(?!(?:[^<]*>|[^<>]*<\/pre>))([^*]*)\*/g // bold but ignore pre
	const italic = /_(?!(?:[^<]*>|[^<>]*<\/pre>))([^_]*)_/g // italic but ignore pre
	const strikethrough = /~(?!(?:[^<]*>|[^<>]*<\/pre>))([^~]*)~/g // strikethrough but ignore pre
	const blockquote = /(?<!<pre>)&gt;(.*)/g // blockquote but ignore pre
	const single_newline = /(\n)/g
	const consecutive_brs = /(<br \/>){2,}/g

	let parsed = text
	parsed = parsed.replace(pre, "<pre>$1</pre>")
	parsed = parsed.replace(code, "<code>$1</code>")
	parsed = parsed.replace(blockquote, "<blockquote>$1</blockquote>")
	parsed = parsed.replace(bold, "<b>$1</b>")
	parsed = parsed.replace(italic, "<i>$1</i>")
	parsed = parsed.replace(strikethrough, "<s>$1</s>")
	parsed = parsed.replace(single_newline, "<br />")

	//  REPLACE CONSECUTIVE BRs WITH A SAME NUMBER OF BRs WITH MARGIN-TOP 8PX (TO SIMULATE A NEW LINE) BUT KEEP THE FIRST ONE AS IT IS.
	parsed = parsed.replace(consecutive_brs, (match) => {
		const count = (match.match(/<br \/>/g)?.length ?? 0) - 1
		let spans = "<br />"

		for (let i = 0; i < count; i++) {
			spans += `<br style="display:block;content:'';margin-top:8px" />`
		}
		return spans
	})

	return parse(parsed, options)
}

// 1. https://app.slack.com/block-kit-builder/T01HP7H5HME#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22This%20is%20unquoted%20text%5Cn%3EThis%20is%20quoted%20text%5Cn%3EThis%20is%20still%20quoted%20text%5CnThis%20is%20unquoted%20text%20again%22%7D%7D%5D%7D

// 2. https://app.slack.com/block-kit-builder/T01HP7H5HME#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%60%60%60const%20bold%20=%20/*(.*?)*/g%20const%20italic%20=%20/_(.*?)_/g%20const%20strikethrough%20=%20/~(.*?)~/g%20const%20code%20=%20/%60(.*?)%60/g%20const%20pre%20=%20/%60%60%60(.*?)%60%60%60/g%20const%20blockquote%20=%20/%3E(.*)/g%20const%20single_newline%20=%20/(%5Cn)/g%20const%20consecutive_brs%20=%20/(%3Cbr%20/%3E)%7B2,%7D/g%60%60%60%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22text%22:%22Responses:%20:lock:%20Anonymous%20%20%20%7C%20%20%20Responses%20shared%20in:%20%3C#C04NNUPQ803%3E%20%20%20%7C%20%20%20%3Chttps://vimeo.com/801826669%7C:tv:%201%20min%20demo%3E%22,%22type%22:%22mrkdwn%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Happy%20Feedback%20Friday*%5Cn%5CnTime%20to%20share%20your%20thoughts%5Cn_Seriously...%20share%20below!_%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://res.cloudinary.com/incognito-apps-inc/image/upload/v1681915246/finish_line_evgza1.webp%22,%22alt_text%22:%22feedback%20fridays%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*:one:%20How's%20your%20work%20week%20going?*%22%7D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:white_frowning_face:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222171%7C%7C:white_frowning_face:%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:neutral_face:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222171%7C%7C:neutral_face:%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:smiley:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222171%7C%7C:smiley:%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22text%22:%22Send%20feedback%20from%20outside%20of%20Slack%20without%20signing%20in:%20%3Chttps://beta.incognitoapps.com/feedback/koctWf?prompt=What's%20your%20hot%20take%20on%20how%20the%20company%20can%20improve?%20:fire:%7Cbeta.incognitoapps.com/feedback/koctWf%3E%22,%22type%22:%22mrkdwn%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D%5D%7D

// 3. https://app.slack.com/block-kit-builder/T01HP7H5HME#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22:truck:%20Hello%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22text%22:%22Responses:%20:lock:%20Anonymous%20%20%20%7C%20%20%20Responses%20shared%20in:%20%3C#C04NNUPQ803%3E%20%20%20%7C%20%20%20%3Chttps://vimeo.com/801826669%7C:tv:%201%20min%20demo%3E%22,%22type%22:%22mrkdwn%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Happy%20Feedback%20Friday*%5Cn%5CnTime%20to%20share%20your%20thoughts%5Cn_Seriously...%20share%20below!_%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://res.cloudinary.com/incognito-apps-inc/image/upload/v1681915246/finish_line_evgza1.webp%22,%22alt_text%22:%22feedback%20fridays%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*:one:%20How's%20your%20work%20week%20going?*%22%7D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:white_frowning_face:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222218%7C%7C:white_frowning_face:%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:neutral_face:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222218%7C%7C:neutral_face:%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22:smiley:%22,%22emoji%22:true%7D,%22type%22:%22button%22,%22value%22:%222218%7C%7C:smiley:%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22text%22:%22Send%20feedback%20from%20outside%20of%20Slack%20without%20signing%20in:%20%3Chttps://beta.incognitoapps.com/feedback/koctWf?prompt=What's%20your%20hot%20take%20on%20how%20the%20company%20can%20improve?%20:fire:%7Cbeta.incognitoapps.com/feedback/koctWf%3E%22,%22type%22:%22mrkdwn%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%20%22%7D%7D%5D%7D

// 4. https://api.slack.com/reference/surfaces/formatting#escaping

// 5. https://www.markdownguide.org/tools/slack/

//  6. https://slack.com/intl/en-gb/help/articles/202288908-Format-your-messages

// 7. https://dev-incognitoslack.slack.com/archives/D047HQ17HFS/p1682018553742999
