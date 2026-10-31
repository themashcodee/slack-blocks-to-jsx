// The `auth_provider` block shows an authentication provider's icon, name and connection state.
// Slack hasn't published a reference page yet; fields follow the Java SDK's AuthProviderBlock.
// These tests lock in the connected and disconnected states, the Connect button's derived
// action_id and the icon fallback. Run against the built dist/ (CI builds first).

import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Message } from "../dist/index.mjs";

const render = (blocks) =>
  ReactDOMServer.renderToStaticMarkup(
    React.createElement(Message, {
      logo: "logo.png",
      name: "Tester",
      theme: "light",
      blocks,
    }),
  );

const plain = (text) => ({ type: "plain_text", text });

const disconnected = {
  type: "auth_provider",
  block_id: "github_auth",
  value: "github",
  name: plain("GitHub"),
  is_connected: false,
  description: plain("Link pull requests and issues to this channel"),
  icon_url: "https://example.com/github.png",
  auth_url: "https://example.com/oauth/github",
  connected_identity: plain("octocat"),
  connected_context: plain("acme-org"),
};

const connected = {
  ...disconnected,
  is_connected: true,
  disconnect_url: "https://example.com/oauth/github/disconnect",
  accessory: {
    type: "overflow",
    action_id: "github_menu",
    options: [
      { text: plain("Re-authenticate"), value: "reauth" },
      { text: plain("Disconnect"), value: "disconnect" },
    ],
  },
};

test("disconnected: icon, name, description and a Connect button with the derived action_id", () => {
  const out = render([disconnected]);
  assert.match(out, /id="github_auth"/);
  assert.match(out, /<img[^>]*src="https:\/\/example.com\/github.png"/);
  assert.match(out, /GitHub/);
  assert.match(out, /Link pull requests and issues to this channel/);
  assert.match(out, /<button[^>]*id="auth_provider_connect_github"[^>]*>.*Connect/);
  // connection details and the overflow menu are only shown once connected
  assert.doesNotMatch(out, /octocat/);
  assert.doesNotMatch(out, /acme-org/);
  assert.doesNotMatch(out, /overflow_menu_element/);
});

test("connected: identity and context with the overflow accessory, no Connect button", () => {
  const out = render([connected]);
  assert.match(out, /octocat/);
  assert.match(out, /acme-org/);
  assert.match(out, /slack_blocks_to_jsx__overflow_menu_element/);
  assert.match(out, /id="github_menu"/);
  assert.doesNotMatch(out, /auth_provider_connect_github/);
});

test("connected without an accessory renders no action", () => {
  const { accessory, ...noMenu } = connected;
  const out = render([noMenu]);
  assert.doesNotMatch(out, /<button/);
  assert.match(out, /octocat/);
});

test("without icon_url, a placeholder shows the provider's initial", () => {
  const { icon_url, ...noIcon } = disconnected;
  const out = render([noIcon]);
  assert.doesNotMatch(out, /<img[^>]*github.png/);
  assert.match(out, /auth_provider_icon--placeholder">G</);
});
