import { TextObject } from "./objects";
import {
  CheckboxesElement,
  DatePickerElement,
  Element,
  ImageElement,
  MultiStaticSelectElement,
  PlainTextInputElement,
  RadioButtonsElement,
  StaticSelectElement,
  UsersSelectElement,
} from ".";
import { AnyRichTextBlockElement } from "../original_types";

export type Block =
  | ActionsBlock
  | ContextBlock
  | DividerBlock
  | FileBlock
  | HeaderBlock
  | ImageBlock
  | InputBlock
  | SectionBlock
  | VideoBlock
  | RichTextBlock;

export type ActionsBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q?cdn_fallback=1&force_cold_boot=1#%7B%22blocks%22:%5B%7B%22type%22:%22actions%22,%22block_id%22:%22actions1%22,%22elements%22:%5B%7B%22type%22:%22static_select%22,%22placeholder%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Which%20witch%20is%20the%20witchiest%20witch?%22%7D,%22action_id%22:%22select_2%22,%22options%22:%5B%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Matilda%22%7D,%22value%22:%22matilda%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Glinda%22%7D,%22value%22:%22glinda%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Granny%20Weatherwax%22%7D,%22value%22:%22grannyWeatherwax%22%7D,%7B%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Hermione%22%7D,%22value%22:%22hermione%22%7D%5D%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Cancel%22%7D,%22value%22:%22cancel%22,%22action_id%22:%22button_1%22%7D%5D%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#actions View here}
   *
   * A block that is used to hold multiple interactive {@link https://api.slack.com/reference/messaging/block-elements elements}.
   */
  type: "actions";
  /**
   * An array of interactive {@link https://api.slack.com/reference/messaging/block-elements elements objects} - {@link https://api.slack.com/reference/messaging/block-elements#button buttons}, {@link https://api.slack.com/reference/messaging/block-elements#select select menus}, {@link https://api.slack.com/reference/messaging/block-elements#overflow overflow menus}, or {@link https://api.slack.com/reference/messaging/block-elements#datepicker date pickers}. There is a maximum of 25 elements in each action block.
   */
  elements: Element[];
  /**
   * A string acting as a unique identifier for a block. If not specified, a ***block_id*** will be generated. You can use this ***block_id*** when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type ContextBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22blocks%22:%5B%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22image%22,%22image_url%22:%22https://image.freepik.com/free-photo/red-drawing-pin_1156-445.jpg%22,%22alt_text%22:%22images%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22Location:%20*Dogpatch*%22%7D%5D%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#context View here}
   *
   * Displays message context, which can include both images and text.
   */
  type: "context";
  /**
   * An array of {@link https://api.slack.com/reference/messaging/block-elements#image image elements} and {@link https://api.slack.com/reference/messaging/composition-objects#text text objects}. Maximum number of items is 10.
   */
  elements: (ImageElement | TextObject)[];
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type DividerBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22blocks%22:%5B%7B%22type%22:%22divider%22,%22block_id%22:%22divider1%22%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#divider View here}
   *
   * A content divider, like an ***<hr>***, to split up different blocks inside of a message. The divider block is nice and neat, requiring only a ***type***.
   */
  type: "divider";
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type FileBlock = {
  /**
   * Available in surfaces: **Messages**
   *
   * * Example: {@link https://api.slack.com/reference/block-kit/blocks#file_examples View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#file View here}
   *
   * Displays a {@link https://api.slack.com/messaging/files/remote remote file}. You can't add this block to app surfaces directly, but it will show up when {@link https://api.slack.com/messaging/retrieving retrieving messages} that contain remote files.
   *
   * If you want to add remote files to messages, {@link https://api.slack.com/messaging/files/remote follow our guide}.
   */
  type: "file";
  /**
   * The external unique ID for this file.
   */
  external_id: string;
  /**
   * At the moment, **source*** will always be remote for a ***remote*** file.
   */
  source: "remote";
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type HeaderBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22type%22:%22home%22,%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Budget%20Performance%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Current%20Quarter*%5CnBudget:%20$18,000%20(ends%20in%2053%20days)%5CnSpend:%20$4,289.70%5CnRemain:%20$13,710.30%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Top%20Expense%20Categories*%5Cn:airplane:%20Flights%20%C2%B7%2030%25%5Cn:taxi:%20Taxi%20/%20Uber%20/%20Lyft%20%C2%B7%2024%25%20%5Cn:knife_fork_plate:%20Client%20lunch%20/%20meetings%20%C2%B7%2018%25%22%7D%5D%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22image%22,%22image_url%22:%22https://api.slack.com/img/blocks/bkb_template_images/placeholder.png%22,%22alt_text%22:%22placeholder%22%7D%5D%7D,%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Expenses%20Awaiting%20Your%20Approval%22%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22Submitted%20by%22%7D,%7B%22type%22:%22image%22,%22image_url%22:%22https://api.slack.com/img/blocks/bkb_template_images/profile_3.png%22,%22alt_text%22:%22Dwight%20Schrute%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Dwight%20Schrute*%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Team%20Lunch%20(Internal)*%5CnCost:%20*$85.50USD*%5CnDate:%20*10/16/2019*%5CnService%20Provider:%20*Honest%20Sandwiches*%20%20%5CnExpense%20no.%20*%3Cfakelink.toUrl.com%7C#1797PD%3E*%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://api.slack.com/img/blocks/bkb_template_images/creditcard.png%22,%22alt_text%22:%22credit%20card%22%7D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Approve%22,%22emoji%22:true%7D,%22style%22:%22primary%22,%22value%22:%22approve%22%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Decline%22,%22emoji%22:true%7D,%22style%22:%22danger%22,%22value%22:%22decline%22%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22View%20Details%22,%22emoji%22:true%7D,%22value%22:%22details%22%7D%5D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22Submitted%20by%22%7D,%7B%22type%22:%22image%22,%22image_url%22:%22https://api.slack.com/img/blocks/bkb_template_images/profile_2.png%22,%22alt_text%22:%22Pam%20Beasely%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Pam%20Beasely*%22%7D%5D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Flights%20to%20New%20York*%5CnCost:%20*$520.78USD*%5CnDate:%20*10/18/2019*%5CnService%20Provider:%20*Delta%20Airways*%5CnExpense%20no.%20*%3Cfakelink.toUrl.com%7C#1803PD%3E*%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://api.slack.com/img/blocks/bkb_template_images/plane.png%22,%22alt_text%22:%22plane%22%7D%7D,%7B%22type%22:%22actions%22,%22elements%22:%5B%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Approve%22,%22emoji%22:true%7D,%22style%22:%22primary%22,%22value%22:%22approve%22%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Decline%22,%22emoji%22:true%7D,%22style%22:%22danger%22,%22value%22:%22decline%22%7D,%7B%22type%22:%22button%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22View%20Details%22,%22emoji%22:true%7D,%22value%22:%22details%22%7D%5D%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#header View here}
   *
   * A ***header*** is a plain-text block that displays in a larger, bold font. Use it to delineate between different groups of content in your app's surfaces.
   */
  type: "header";
  /**
   * The text for the block, in the form of a {@link https://api.slack.com/reference/messaging/composition-objects#text **plain_text** text object}. Maximum length for the ***text*** in this field is 150 characters.
   */
  text: TextObject<"plain_text">;
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type ImageBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22blocks%22:%5B%7B%22type%22:%22image%22,%22title%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Please%20enjoy%20this%20photo%20of%20a%20kitten%22%7D,%22block_id%22:%22image4%22,%22image_url%22:%22http://placekitten.com/500/500%22,%22alt_text%22:%22An%20incredibly%20cute%20kitten.%22%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#image View here}
   *
   * A simple image block, designed to make those cat photos really pop.
   */
  type: "image";
  /**
   * The URL of the image to be displayed. Maximum length for this field is 3000 characters.
   */
  image_url: string;
  /** Width of image in pixels (NOT PRESENT IN THE SLACK API BUT THEY ADD IT DYNAMICALLY) */
  image_width?: number;
  /** Height of image in pixels (NOT PRESENT IN THE SLACK API BUT THEY ADD IT DYNAMICALLY) */
  image_height?: number;
  /**  Size of image in bytes (NOT PRESENT IN THE SLACK API BUT THEY ADD IT DYNAMICALLY) */
  image_bytes?: number;
  /** An optional flag indicating that this image is a piece of a larger image. (NOT PRESENT IN THE SLACK API BUT THEY ADD IT DYNAMICALLY) */
  is_animated?: boolean;
  /** Fallback configuration for this image. (NOT PRESENT IN THE SLACK API BUT THEY ADD IT DYNAMICALLY) */
  fallback?: `${number}x${number}px image`;
  /**
   * A plain-text summary of the image. This should not contain any markup. Maximum length for this field is 2000 characters.
   */
  alt_text: string;
  /**
   * An optional title for the image in the form of a {@link https://api.slack.com/reference/messaging/composition-objects#text text object} that can only be of ***type: plain_text***. Maximum length for the ***text*** in this field is 2000 characters.
   */
  title?: TextObject<"plain_text">;
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
};

export type InputBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22title%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Add%20info%20to%20feedback%22,%22emoji%22:true%7D,%22submit%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Save%22,%22emoji%22:true%7D,%22type%22:%22modal%22,%22blocks%22:%5B%7B%22type%22:%22input%22,%22element%22:%7B%22type%22:%22plain_text_input%22%7D,%22label%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Label%22,%22emoji%22:true%7D%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#input View here}
   *
   * A block that collects information from users - it can hold a {@link https://api.slack.com/reference/block-kit/block-elements#input plain-text input element}, a {@link https://api.slack.com/reference/block-kit/block-elements#checkboxes checkbox element}, a {@link radio button element}, a {@link https://api.slack.com/reference/block-kit/block-elements#select select menu element}, a {@link https://api.slack.com/reference/block-kit/block-elements#multi_select multi-select menu element}, or a {@link https://api.slack.com/reference/block-kit/block-elements#datepicker datepicker}.
   *
   * Read our guides to collecting input {@link https://api.slack.com/surfaces/modals#gathering_input in modals} or {@link https://api.slack.com/surfaces/tabs/using#gathering_input in Home tabs} to learn how input blocks pass information to your app.
   */
  type: "input";
  /**
   * A label that appears above an input element in the form of a text object that must have ***type*** of ***plain_text***. Maximum length for the ***text*** in this field is 2000 characters.
   */
  label: TextObject<"plain_text">;
  /**
   * A plain-text input element, a checkbox element, a radio button element, a select menu element, a multi-select menu element, or a datepicker.
   */
  element:
    | PlainTextInputElement
    | CheckboxesElement
    | RadioButtonsElement
    | StaticSelectElement
    | MultiStaticSelectElement
    | DatePickerElement
    | UsersSelectElement;
  /**
   * A boolean that indicates whether or not the use of elements in this block should dispatch a {@link https://api.slack.com/reference/interaction-payloads/block-actions ***block_actions*** payload}. Defaults to false.
   */
  dispatch_action?: boolean;
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message or view and each iteration of a message or view. If a message or view is updated, use a new ***block_id***.
   */
  block_id?: string;
  /**
   * An optional hint that appears below an input element in a lighter grey. It must be a {@link https://api.slack.com/reference/messaging/composition-objects#text text object} with a ***type*** of ***plain_text***. Maximum length for the ***text*** in this field is 2000 characters.
   */
  hint?: TextObject<"plain_text">;
  /**
   * A boolean that indicates whether the input element may be empty when a user submits the modal. Defaults to ***false***.
   */
  optional?: boolean;
};

export type SectionBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://app.slack.com/block-kit-builder/T0385D58J4Q#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22text%22:%22*Sally*%20has%20requested%20you%20set%20the%20deadline%20for%20the%20Nano%20launch%20project%22,%22type%22:%22mrkdwn%22%7D,%22accessory%22:%7B%22type%22:%22datepicker%22%7D%7D%5D%7D View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#section View here}
   *
   * A ***section*** is one of the most flexible blocks available - it can be used as a simple text block, in combination with text fields, or side-by-side with any of the available {@link https://api.slack.com/reference/messaging/block-elements block elements}.
   */
  type: "section";
  /**
   * The text for the block, in the form of a {@link https://api.slack.com/reference/messaging/composition-objects#text text object}. Maximum length for the text in this field is 3000 characters. This field is not required if a valid array of fields objects is provided instead.
   */
  text?: TextObject;
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. You can use this ***block_id*** when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
  /**
   * Required if no ***text*** is provided. An array of {@link https://api.slack.com/reference/messaging/composition-objects#text text objects}. Any text objects included with ***fields*** will be rendered in a compact format that allows for 2 columns of side-by-side text. Maximum number of items is 10. Maximum length for the ***text*** in each item is 2000 characters. {@link https://api.slack.com/tools/block-kit-builder?blocks=%5B%0A%09%7B%0A%09%09%22type%22%3A%20%22section%22%2C%0A%09%09%22text%22%3A%20%7B%0A%09%09%09%22text%22%3A%20%22A%20message%20*with%20some%20bold%20text*%20and%20_some%20italicized%20text_.%22%2C%0A%09%09%09%22type%22%3A%20%22mrkdwn%22%0A%09%09%7D%2C%0A%09%09%22fields%22%3A%20%5B%0A%09%09%09%7B%0A%09%09%09%09%22type%22%3A%20%22mrkdwn%22%2C%0A%09%09%09%09%22text%22%3A%20%22*Priority*%22%0A%09%09%09%7D%2C%0A%09%09%09%7B%0A%09%09%09%09%22type%22%3A%20%22mrkdwn%22%2C%0A%09%09%09%09%22text%22%3A%20%22*Type*%22%0A%09%09%09%7D%2C%0A%09%09%09%7B%0A%09%09%09%09%22type%22%3A%20%22plain_text%22%2C%0A%09%09%09%09%22text%22%3A%20%22High%22%0A%09%09%09%7D%2C%0A%09%09%09%7B%0A%09%09%09%09%22type%22%3A%20%22plain_text%22%2C%0A%09%09%09%09%22text%22%3A%20%22String%22%0A%09%09%09%7D%0A%09%09%5D%0A%09%7D%0A%5D Click here for an example}.
   */
  fields?: TextObject[];
  /**
   * One of the available {@link https://api.slack.com/reference/messaging/block-elements element objects}.
   */
  accessory?: Element;
};

export type VideoBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   * * Example: {@link https://api.slack.com/reference/block-kit/blocks#video_examples View here}
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#video View here}
   *
   * A ***video*** block is designed to embed videos in all app surfaces (e.g. link unfurls, messages, modals, App Home) — anywhere you can put blocks! To use the video block within your app, you must have the ***links.embed:write*** scope.
   *
   * Requirements
   * - Video blocks can only be posted by apps; users are not allowed to post embedded videos directly from Block Kit Builder.
   * - Your app must have the the ***links.embed:write*** scope for both user and bot tokens.
   * - ***video_url*** has to be included in the {@link https://api.slack.com/reference/messaging/link-unfurling#configuring_domains unfurl domains} specified in your app.
   * - ***video_url*** should be publicly accessible, unless the app relies on information received from the {@link https://api.slack.com/apis/connections/events-api Events API} payloads to make a decision on whether the viewer(s) of the content should have access. If so, the service could create a unique URL accessible only via Slack.
   * - ***video_url*** must be compatible with an embeddable iFrame.
   * - ***video_url*** must return a 2xx code OR 3xx with less than 5 redirects and an eventual 2xx.
   * - ***video_url*** must not point to any Slack-related domain.
   *
   * Constraints
   * - Embeddable video players only (audio-only permitted)
   * - Navigation, scrolling and overlays are not allowed within the iFrame.
   * - Interactivity (e.g. likes, comments, and reactions) are allowed within your player but shouldn't completely overlay or navigate away from the content being embedded. These interactions will be anonymous since no user data is transferred to the embedded view.
   *
   * The metadata received in the Block payload will be used to construct the description, provider, and title of the video in all clients. Developers have the flexibility to leave non-mandatory fields null and use other blocks to format this content.
   */
  type: "video";
  /**
   * A tooltip for the video. Required for accessibility
   */
  alt_text: string;
  /**
   * Author name to be displayed. Must be less than 50 characters.
   */
  author_name?: string;
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
  /**
   * Description for video in plain text format.
   */
  description?: TextObject<"plain_text">;
  /**
   * Icon for the video provider - ex. Youtube icon
   */
  provider_icon_url?: string;
  /**
   * The originating application or domain of the video ex. Youtube
   */
  provider_name?: string;
  /**
   * Video title in plain text format. Must be less than 200 characters.
   */
  title: TextObject<"plain_text">;
  /**
   * Hyperlink for the title text. Must correspond to the non-embeddable URL for the video. Must go to an HTTPS URL.
   */
  title_url?: string;
  /**
   * The thumbnail image URL
   */
  thumbnail_url: string;
  /**
   * The URL to be embedded. Must match any existing {@link https://api.slack.com/reference/messaging/link-unfurling#configuring_domains unfurl domains} within the app and point to a HTTPS URL.
   */
  video_url: string;
};

export type RichTextBlock = {
  /**
   * Available in surfaces: **Modals**, **Messages**, **Home tabs**
   *
   *  * Example: {@link https://app.slack.com/block-kit-builder/T01HP7H5HME#%7B%22blocks%22:%5B%7B%22type%22:%22rich_text%22,%22elements%22:%5B%7B%22type%22:%22rich_text_section%22,%22elements%22:%5B%7B%22type%22:%22text%22,%22text%22:%22Hello%20there,%20I%20am%20a%20basic%20rich%20text%20block!%22%7D%5D%7D%5D%7D%5D%7D View here}
   *
   * * Docs: {@link https://api.slack.com/reference/block-kit/blocks#rich_text View here}
   *
   * A ***rich_text*** block is a formatted, structured representation of text. It is the output of the Slack client's WYSIWYG composer, so all messages sent by end-users will have this format. You can use this block to create your own formatted text in Block Kit Builder or include user-defined formatted text in your Block Kit payload. You might encounter ***rich_text*** blocks in message payloads coming from our APIs, as a built-in type in the next-generation Slack platform, or as output of the ***rich_text_input*** block.
   */
  type: "rich_text";
  /**
   * A string acting as a unique identifier for a block. If not specified, one will be generated. Maximum length for this field is 255 characters. ***block_id*** should be unique for each message and each iteration of a message. If a message is updated, use a new ***block_id***.
   */
  block_id?: string;
  /**
   * An array of rich text objects - rich_text_section, rich_text_list, rich_text_preformatted, and rich_text_quote. See your specific desired element below for more details.
   */
  elements: AnyRichTextBlockElement[];
};
