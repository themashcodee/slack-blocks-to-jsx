import { Block } from "../types";

/**
 * Sanitizes blocks for Slack Block Kit Builder by removing custom properties
 * and fixing compatibility issues that would cause validation errors.
 */
export const sanitizeBlocksForSlack = (blocks: Block[]): unknown[] => {
  return blocks.map(sanitizeBlock);
};

const sanitizeBlock = (block: Block): unknown => {
  // Remove custom/dynamic properties from image blocks
  if (block.type === "image") {
    const { image_width, image_height, image_bytes, is_animated, fallback, ...clean } = block;
    return clean;
  }

  // Remove custom iframeProps from video blocks
  if (block.type === "video") {
    const { iframeProps, ...clean } = block;
    return clean;
  }

  // Sanitize accessory elements in section blocks
  if (block.type === "section" && block.accessory) {
    return {
      ...block,
      accessory: sanitizeElement(block.accessory),
    };
  }

  // Sanitize elements in actions blocks
  if (block.type === "actions") {
    return {
      ...block,
      elements: block.elements.map(sanitizeElement),
    };
  }

  // Sanitize element in input blocks
  if (block.type === "input") {
    return {
      ...block,
      element: sanitizeElement(block.element),
    };
  }

  return block;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeElement = (element: any): unknown => {
  if (!element || typeof element !== "object") return element;

  // Remove custom `people` property from users_select / multi_users_select
  if (element.type === "users_select" || element.type === "multi_users_select") {
    const { people, ...clean } = element;
    return clean;
  }

  return element;
};
