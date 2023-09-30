export type TextObjectTextType = "plain_text" | "mrkdwn"
export type Style = "primary" | "danger" | "confirm"

export type ConfirmDialogObject = {
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text***-only text object} that defines the dialog's title. Maximum length for this field is 100 characters.
	 */
	title: TextObject<"plain_text">
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text text object} that defines the explanatory text that appears in the confirm dialog. Maximum length for the ***text*** in this field is 300 characters.
	 */
	text: TextObject
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text***-only text object} to define the text of the button that confirms the action. Maximum length for the ***text*** in this field is 30 characters.
	 */
	confirm: TextObject<"plain_text">
	deny: TextObject<"plain_text">
	/**
	 * Defines the color scheme applied to the confirm button. A value of danger will display the button with a red background on desktop, or red text on mobile. A value of primary will display the button with a green background on desktop, or blue text on mobile. If this field is not provided, the default value will be primary.
	 */
	style?: Style
}

export type TextObject<T extends TextObjectTextType = TextObjectTextType> = {
	/**
	 * The formatting to use for this text object. Can be one of ***plain_text*** or ***mrkdwn***.
	 */
	type: T extends void ? TextObjectTextType : T
	/**
	 * The text for the block. This field accepts any of the standard {@link https://api.slack.com/reference/surfaces/formatting text formatting markup} when ***type*** is ***mrkdwn***. The maximum length is 3000 characters.
	 */
	text: string
	/**
	 * Indicates whether emojis in a text field should be escaped into the colon emoji format. This field is only usable when ***type*** is ***plain_text***.
	 */
	emoji?: boolean
	/**
	 * When set to ***false*** (as is default) URLs will be auto-converted into links, conversation names will be link-ified, and certain mentions will be {@link https://api.slack.com/reference/surfaces/formatting#automatic-parsing automatically parsed}. Using a value of ***true*** will skip any preprocessing of this nature, although you can still include {@link https://api.slack.com/reference/surfaces/formatting#advanced manual parsing strings}. This field is only usable when ***type*** is ***mrkdwn***
	 */
	verbatim?: boolean
}

export type OptionObject = {
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text  object} that defines the text shown in the option on the menu. Overflow, select, and multi-select menus can only use ***plain_text*** objects, while radio buttons and checkboxes can use ***mrkdwn*** text objects. Maximum length for the ***text*** in this field is 75 characters.
	 */
	text: TextObject
	/**
	 * A unique string value that will be passed to your app when this option is chosen. Maximum length for this field is 75 characters.
	 */
	value: string
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text***-only text object} that defines a line of descriptive text shown below the ***text*** field beside the radio button. Maximum length for the ***text*** object within this field is 75 characters.
	 */
	description?: TextObject<"plain_text">
	/**
	 * A URL to load in the user's browser when the option is clicked. **The url attribute is only available in** {@link https://api.slack.com/reference/block-kit/block-elements#overflow overflow menus}. Maximum length for this field is 3000 characters. If you're using ***url***, you'll still receive an {@link https://api.slack.com/interactivity/handling#payloads interaction payload} and will need to {@link https://api.slack.com/interactivity/handling#acknowledgment_response send an acknowledgement response}.
	 */
	url?: string
}

export type OptionGroupObject = {
	/**
	 * A {@link https://api.slack.com/reference/block-kit/composition-objects#text plain_text only text object} that defines the label shown above this group of options. Maximum length for the ***text*** in this field is 75 characters.
	 */
	label: TextObject<"plain_text">
	/**
	 * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects} that belong to this specific group. Maximum of 100 items.
	 */
	options: OptionObject[]
}

export type DispatchActionConfigObject = {
	/**
     * An array of interaction types that you would like to receive a {@link https://api.slack.com/reference/interaction-payloads/block-actions block_actions payload} for. Should be one or both of:
     
     * ***on_enter_pressed*** — payload is dispatched when user presses the enter key while the input is in focus. Hint text will appear underneath the input explaining to the user to press enter to submit.
    
    * ***on_character_entered*** — payload is dispatched when a character is entered (or removed) in the input.
     */
	trigger_actions_on?: string[]
}

export type FilterObject = {
	/**
     * Indicates which type of conversations should be included in the list. When this field is provided, any conversations that do not match will be excluded
     
     * You should provide an array of strings from the following options: ***im***, ***mpim***, ***private***, and ***public***. The array cannot be empty.
     */
	include?: string[]
	/**
	 * Indicates whether to exclude external {@link https://api.slack.com/enterprise/shared-channels shared channels} from conversation lists. Defaults to ***false***.
	 */
	exclude_external_shared_channels?: boolean
	/**
	 * Indicates whether to exclude bot users from conversation lists. Defaults to ***false***.
	 */
	exclude_bot_users?: boolean
}
