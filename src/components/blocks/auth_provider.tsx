import { AuthProviderBlock } from "../../types";
import { TextObject } from "../composition_objects";
import { ButtonElement } from "../elements/button_element";
import { OverflowMenuElement } from "../elements/overflow_menu_element";

type AuthProviderProps = {
  data: AuthProviderBlock;
};

export const AuthProvider = (props: AuthProviderProps) => {
  const {
    value,
    name,
    is_connected,
    description,
    icon_url,
    auth_url,
    connected_identity,
    connected_context,
    accessory,
    block_id,
  } = props.data;

  const initial = name?.text?.trim().charAt(0).toUpperCase() || "";

  return (
    <div
      id={block_id}
      className="mt-2 mb-1 flex items-center gap-3 w-full text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__auth_provider"
    >
      {icon_url ? (
        <img
          src={icon_url}
          alt=""
          className="w-9 h-9 rounded-lg object-cover shrink-0 slack_blocks_to_jsx__auth_provider_icon"
        />
      ) : (
        // Slack falls back to the app's avatar, which a block can't see; show the name's initial.
        <span
          aria-hidden="true"
          className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center bg-gray-secondary dark:bg-dark-bg-secondary border border-black-primary/[0.13] dark:border-dark-border font-bold text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__auth_provider_icon slack_blocks_to_jsx__auth_provider_icon--placeholder"
        >
          {initial}
        </span>
      )}

      <div className="flex flex-col min-w-0 flex-1">
        {name && (
          <span className="font-bold truncate slack_blocks_to_jsx__auth_provider_name">
            <TextObject data={name} />
          </span>
        )}
        {description && (
          <span className="text-small text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__auth_provider_description">
            <TextObject data={description} />
          </span>
        )}
        {is_connected && (connected_identity || connected_context) && (
          <span className="flex items-center gap-1 min-w-0 text-small text-black-secondary dark:text-dark-text-secondary slack_blocks_to_jsx__auth_provider_connection">
            <span aria-hidden="true" className="w-2 h-2 rounded-full shrink-0 bg-green-secondary" />
            {connected_identity && (
              <TextObject
                data={connected_identity}
                className="min-w-0 truncate font-semibold text-black-primary"
              />
            )}
            {connected_identity && connected_context && <span aria-hidden="true">·</span>}
            {connected_context && (
              <TextObject data={connected_context} className="min-w-0 truncate" />
            )}
          </span>
        )}
      </div>

      <div className="shrink-0 slack_blocks_to_jsx__auth_provider_action">
        {is_connected ? (
          accessory && <OverflowMenuElement data={accessory} />
        ) : (
          <ButtonElement
            data={{
              type: "button",
              text: { type: "plain_text", text: "Connect" },
              action_id: `auth_provider_connect_${value}`,
              value,
              url: auth_url,
            }}
          />
        )}
      </div>
    </div>
  );
};
