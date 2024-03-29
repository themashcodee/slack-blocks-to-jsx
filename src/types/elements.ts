import {
  ConfirmDialogObject,
  DispatchActionConfigObject,
  FilterObject,
  OptionGroupObject,
  OptionObject,
  Style,
  TextObject,
  OptionObjectWithoutUrl,
} from ".";

export type Element =
  | ButtonElement
  | CheckboxesElement
  | DatePickerElement
  | DateTimePickerElement
  | EmailInputElement
  | ImageElement
  | MultiStaticSelectElement
  | MultiExternalSelectElement
  | MultiUsersSelectElement
  | MultiConversationsSelectElement
  | MultiChannelsSelectElement
  | NumberInputElement
  | OverflowMenuElement
  | PlainTextInputElement
  | RadioButtonsElement
  | StaticSelectElement
  | ExternalSelectElement
  | UsersSelectElement
  | ConversationsSelectElement
  | ChannelsSelectElement
  | TimePickerElement
  | UrlTextInputElement;

export type ButtonElement = {
  type: "button";
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text text object} that defines the button's text. Can only be of ***type: plain_text***. ***text*** may truncate with ~30 characters. Maximum length for the ***text*** in this field is 75 characters.
   */
  text: TextObject<"plain_text">;
  /**
   * An identifier for this action. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_ids*** in the containing block. Maximum length for this field is 255 characters.
   */
  action_id?: string;
  /**
   * A URL to load in the user's browser when the button is clicked. Maximum length for this field is 3000 characters. If you're using ***url***, you'll still receive an {@link https://api.slack.com/interactivity/handling#payloads interaction payload} and will need to {@link https://api.slack.com/interactivity/handling#acknowledgment_response send an acknowledgement response}.
   */
  url?: string;
  /**
   * The value to send along with the {@link https://api.slack.com/interactivity/handling#payloads interaction payload}. Maximum length for this field is 2000 characters.
   */
  value?: string;
  /**
   * Decorates buttons with alternative visual color schemes. Use this option with restraint.
   *
   * ***primary*** gives buttons a green outline and text, ideal for affirmation or confirmation actions. ***primary*** should only be used for one button within a set.
   *
   * ***danger*** gives buttons a red outline and text, and should be used when the action is destructive. Use ***danger*** even more sparingly than ***primary***.
   *
   * If you don't include this field, the default button style will be used.
   */
  style?: Omit<Style, "confirm"> | undefined;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog after the button is clicked.
   */
  confirm?: ConfirmDialogObject;
  /**
   * A label for longer descriptive text about a button element. This label will be read out by screen readers instead of the button {@link https://api.slack.com/reference/block-kit/composition-objects#text text object}. Maximum length for this field is 75 characters.
   */
  accessibility_label?: string;
};

export type CheckboxesElement = {
  type: "checkboxes";
  /**
   * An identifier for the action triggered when the checkbox group is changed. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects}. A maximum of 10 options are allowed.
   */
  options: OptionObjectWithoutUrl[];
  /**
   * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects} that exactly matches one or more of the options within options. These options will be selected when the checkbox group initially loads.
   */
  initial_options?: OptionObject[];
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after clicking one of the checkboxes in this element.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
};

export type DatePickerElement = {
  type: "datepicker";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial date that is selected when the element is loaded. This should be in the format ***YYYY-MM-DD***.
   */
  initial_date?: string;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a date is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the datepicker. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type DateTimePickerElement = {
  type: "datetimepicker";
  /**
   * An identifier for the input value when the parent modal is submitted. You can use this when you receive a ***view_submission*** payload to {@link https://api.slack.com/surfaces/modals/using#handling-submissions identify the value of the input element}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial date and time that is selected when the element is loaded, represented as a UNUIX timestamp in seconds. This should be in the format of 10 digits, for example ***1628633820*** represents the date and time August 10th, 2021 at 03:17pm PST.
   */
  initial_date_time?: number;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a time is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
};

export type EmailInputElement = {
  type: "email_text_input";
  /**
   * An identifier for the input value when the parent modal is submitted. You can use this when you receive a ***view_submission*** payload to {@link https://api.slack.com/surfaces/modals/using#handling-submissions identify the value of the input element}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial value in the email input when it is loaded.
   */
  initial_value?: string;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#dispatch_action_config dispatch configuration object} that determines when during text input the element returns a {@link https://api.slack.com/reference/interaction-payloads/block-actions block_actions payload}.
   */
  dispatch_action_config?: DispatchActionConfigObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown in the email input. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type ImageElement = {
  type: "image";
  /**
   * The URL of the image to be displayed.
   */
  image_url: string;
  /**
   * A plain-text summary of the image. This should not contain any markup.
   */
  alt_text: string;
};

export type MultiStaticSelectElement = {
  type: "multi_static_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/messaging/interactivity/enabling#understanding_payloads identify the source of the action}. Should be unique among all other ***action_id***s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of {@link https://api.slack.com/reference/messaging/composition-objects#option option objects}. Maximum number of options is 100. If ***option_groups*** is specified, this field should not be.
   */
  options: OptionObject[];
  /**
   * An array of {@link https://api.slack.com/reference/messaging/composition-objects#option_group option group objects}. Maximum number of option groups is 100. If ***options*** is specified, this field should not be.
   */
  option_groups?: OptionGroupObject[];
  /**
   * An array of {@link https://api.slack.com/reference/messaging/composition-objects#option option objects} that exactly match one or more of the options within ***options*** or ***option_groups***. These options will be selected when the menu initially loads.
   */
  initial_options?: OptionObject[];
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears before the multi-select choices are submitted.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.
   */
  max_selected_items?: number;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type MultiExternalSelectElement = {
  type: "multi_external_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/messaging/interactivity/enabling#understanding_payloads identify the source of the action}. Should be unique among all other ***action_id***s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * When the typeahead field is used, a request will be sent on every character change. If you prefer fewer requests or more fully ideated queries, use the ***min_query_length*** attribute to tell Slack the fewest number of typed characters required before dispatch. The default value is ***3***.
   */
  min_query_length?: number;
  /**
   * An array of option objects that exactly match one or more of the options within options or option_groups. These options will be selected when the menu initially loads.
   */
  initial_options?: OptionObject[];
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears before the multi-select choices are submitted.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.
   */
  max_selected_items?: number;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type MultiUsersSelectElement = {
  type: "multi_users_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/messaging/interactivity/enabling#understanding_payloads identify the source of the action}. Should be unique among all other ***action_id***s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of user IDs of any valid users to be pre-selected when the menu loads.
   */
  initial_users?: string[];
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears before the multi-select choices are submitted.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.
   */
  max_selected_items?: number;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type MultiConversationsSelectElement = {
  type: "multi_conversations_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/messaging/interactivity/enabling#understanding_payloads identify the source of the action}. Should be unique among all other ***action_id***s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of one or more IDs of any valid conversations to be pre-selected when the menu loads. If ***default_to_current_conversation*** is also supplied, ***initial_conversations*** will be ignored.
   */
  initial_conversations?: string[];
  /**
   * Pre-populates the select menu with the conversation that the user was viewing when they opened the modal, if available. Default is ***false***.
   */
  default_to_current_conversation?: boolean;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears before the multi-select choices are submitted.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.
   */
  max_selected_items?: number;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#filter_conversations filter object} that reduces the list of available conversations using the specified criteria.
   */
  filter?: FilterObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type MultiChannelsSelectElement = {
  type: "multi_channels_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/messaging/interactivity/enabling#understanding_payloads identify the source of the action}. Should be unique among all other ***action_id***s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of one or more IDs of any valid public channel to be pre-selected when the menu loads.
   */
  initial_channels?: string[];
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears before the multi-select choices are submitted.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.
   */
  max_selected_items?: number;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type NumberInputElement = {
  type: "number_input";
  /**
   * Decimal numbers are allowed if ***is_decimal_allowed*** = ***true***, set the value to false otherwise.
   */
  is_decimal_allowed: boolean;
  /**
   * An identifier for the input value when the parent modal is submitted. You can use this when you receive a ***view_submission*** payload to {@link https://api.slack.com/surfaces/modals/using#handling-submissions identify the value of the input element}. Should be unique among all other ***action_ids*** in the containing block. Maximum length for this field is 255 characters.
   */
  action_id?: string;
  /**
   * The initial value in the plain-text input when it is loaded.
   */
  initial_value?: string;
  /**
   * The minimum value, cannot be greater than ***max_value***.
   */
  min_value?: string;
  /**
   * The maximum value, cannot be less than ***min_value***.
   */
  max_value?: string;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#dispatch_action_config dispatch configuration object} that determines when during text input the element returns a {@link https://api.slack.com/reference/interaction-payloads/block-actions block_actions payload}.
   */
  dispatch_action_config?: DispatchActionConfigObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown in the number input. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type OverflowMenuElement = {
  type: "overflow";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of up to five {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects} to display in the menu.
   */
  options: OptionObject[];
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
};

export type PlainTextInputElement = {
  type: "plain_text_input";
  /**
   * An identifier for the input value when the parent modal is submitted. You can use this when you receive a ***view_submission*** payload to {@link https://api.slack.com/surfaces/modals/using#handling-submissions identify the value of the input element}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial value in the plain-text input when it is loaded.
   */
  initial_value?: string;
  /**
   * Indicates whether the input will be a single line (***false***) or a larger textarea (***true***). Defaults to ***false***
   */
  multiline?: boolean;
  /**
   * The minimum length of input that the user must provide. If the user provides less, they will receive an error. Maximum value is 3000.
   */
  min_length?: number;
  /**
   * The maximum length of input that the user can provide. If the user provides more, they will receive an error.
   */
  max_length?: number;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#dispatch_action_config dispatch configuration object} that determines when during text input the element returns a {@link https://api.slack.com/reference/interaction-payloads/block-actions block_actions payload}.
   */
  dispatch_action_config?: DispatchActionConfigObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown in the plain-text input. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type RadioButtonsElement = {
  type: "radio_buttons";
  /**
   * An identifier for the action triggered when the radio button group is changed. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other action_ids in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects}. A maximum of 10 options are allowed.
   */
  options: OptionObject[];
  /**
   * An {@link https://api.slack.com/reference/messaging/composition-objects#option option object} that exactly matches one of the options within options. This option will be selected when the radio button group initially loads.
   */
  initial_option?: OptionObject;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after clicking one of the radio buttons in this element.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
};

export type StaticSelectElement = {
  type: "static_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option option objects}. Maximum number of options is 100. If option_groups is specified, this field should not be.
   */
  options: OptionObject[];
  /**
   * An array of {@link https://api.slack.com/reference/block-kit/composition-objects#option_group option group objects}. Maximum number of option groups is 100. If ***options*** is specified, this field should not be.
   */
  option_groups?: OptionGroupObject[];
  /**
   * A single option that exactly matches one of the options within {@link OptionObject options} or {@link OptionGroupObject option_groups}. This option will be selected when the menu initially loads.
   */
  initial_option?: OptionObject | OptionGroupObject;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type ExternalSelectElement = {
  type: "external_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * A single option that exactly matches one of the options within {@link OptionObject options} or {@link OptionGroupObject option_groups}. This option will be selected when the menu initially loads.
   */
  initial_option?: OptionObject | OptionGroupObject;
  /**
   * When the typeahead field is used, a request will be sent on every character change. If you prefer fewer requests or more fully ideated queries, use the ***min_query_length*** attribute to tell Slack the fewest number of typed characters required before dispatch. The default value is 3.
   */
  min_query_length?: number;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type UsersSelectElement = {
  type: "users_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The user ID of any valid user to be pre-selected when the menu loads.
   */
  initial_user?: string;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
  /**
   * This is custom property for you to pass the list of people to show in the select menu. (This is not a part of the official Slack API)
   */
  people: {
    id: string;
    name: string;
    image: string;
    online: boolean;
    sleeping: boolean;
  }[];
};

export type ConversationsSelectElement = {
  type: "conversations_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The ID of any valid conversation to be pre-selected when the menu loads. If ***default_to_current_conversation*** is also supplied, ***initial_conversation*** will take precedence.
   */
  initial_conversation?: string;
  /**
   * Pre-populates the select menu with the conversation that the user was viewing when they opened the modal, if available. Default is ***false***.
   */
  default_to_current_conversation?: boolean;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
     * This field only works with menus in {@link https://api.slack.com/reference/block-kit/blocks#input input blocks} in {@link https://api.slack.com/surfaces/modals modals}.
     
     * When set to ***true***, the {@link https://api.slack.com/reference/interaction-payloads/views#view_submission view_submission payload} from the menu's parent view will contain a ***response_url***. This ***response_url*** can be used for {@link https://api.slack.com/interactivity/handling#message_responses message responses}. The target conversation for the message will be determined by the value of this select menu.
     */
  response_url_enabled?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#filter_conversations filter object} that reduces the list of available conversations using the specified criteria.
   */
  filter?: FilterObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type ChannelsSelectElement = {
  type: "channels_select";
  /**
   * An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The ID of any valid public channel to be pre-selected when the menu loads.
   */
  initial_channel?: string;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
     * This field only works with menus in {@link https://api.slack.com/reference/block-kit/blocks#input input blocks} in {@link https://api.slack.com/surfaces/modals modals}.
     
     * When set to ***true***, the {@link https://api.slack.com/reference/interaction-payloads/views#view_submission view_submission payload} from the menu's parent view will contain a ***response_url***. This ***response_url*** can be used for {@link https://api.slack.com/interactivity/handling#message_responses message responses}. The target conversation for the message will be determined by the value of this select menu.
     */
  response_url_enabled?: boolean;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the menu. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type TimePickerElement = {
  type: "timepicker";
  /**
   * An identifier for the action triggered when a time is selected. You can use this when you receive an interaction payload to {@link https://api.slack.com/interactivity/handling#payloads identify the source of the action}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial time that is selected when the element is loaded. This should be in the format ***HH:mm***, where ***HH*** is the 24-hour format of an hour (00 to 23) and ***mm*** is minutes with leading zeros (00 to 59), for example ***22:25*** for 10:25pm.
   */
  initial_time?: string;
  /**
   * A {@link https://api.slack.com/reference/messaging/composition-objects#confirm confirm object} that defines an optional confirmation dialog that appears after a menu item is selected.
   */
  confirm?: ConfirmDialogObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown on the timepicker. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};

export type UrlTextInputElement = {
  type: "url_text_input";
  /**
   * An identifier for the input value when the parent modal is submitted. You can use this when you receive a ***view_submission*** payload {@link https://api.slack.com/surfaces/modals/using#handling-submissions to identify the value of the input element}. Should be unique among all other ***action_id*** s in the containing block. Maximum length for this field is 255 characters.
   */
  action_id: string;
  /**
   * The initial value in the URL input when it is loaded.
   */
  initial_value?: string;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#dispatch_action_config dispatch configuration object} that determines when during text input the element returns a {@link https://api.slack.com/reference/interaction-payloads/block-actions block_actions payload}.
   */
  dispatch_action_config?: DispatchActionConfigObject;
  /**
   * Indicates whether the element will be set to auto focus within the {@link https://api.slack.com/reference/surfaces/views view object}. Only one element can be set to ***true***. Defaults to ***false***.
   */
  focus_on_load?: boolean;
  /**
   * A {@link https://api.slack.com/reference/block-kit/composition-objects#text ***plain_text*** only text object} that defines the placeholder text shown in the URL input. Maximum length for the text in this field is 150 characters.
   */
  placeholder?: TextObject<"plain_text">;
};
