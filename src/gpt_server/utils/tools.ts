import { OpenAI } from "openai";

export const createTools: OpenAI.Responses.Tool[] = [
  {
    type: "function",
    name: "create_rectangle",
    description: "Create a new rectangular shape node with common styling properties.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        name: { type: "string", description: "Semantic name for the node" },
        parentId: { type: "string", description: "FRAME / GROUP / SECTION ID to append the node to", nullable: true },
        fillColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Solid fill in RGBA (defaults to transparent)",
          nullable: true
        },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color in RGBA",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight in px (defaults 1)", nullable: true },
        cornerRadius: { type: "number", minimum: 0, description: "Uniform corner radius in px", nullable: true },
      },
      required: ["x", "y", "width", "height", "name"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_frame",
    description: "Create a new frame container with auto-layout capabilities, styling options, and layout properties.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        name: { type: "string", description: "Semantic name for the node" },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
        fillColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Fill color in RGBA format",
          nullable: true
        },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color in RGBA format",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight in pixel value", nullable: true },
        layoutMode: { type: "string", enum: ["NONE", "HORIZONTAL", "VERTICAL"], description: "Auto-layout mode for the frame", nullable: true },
        layoutWrap: { type: "string", enum: ["NO_WRAP", "WRAP"], description: "Children wrapping configuration for auto-layout frame", nullable: true },
        paddingTop: { type: "number", description: "Top padding value for auto-layout frame", nullable: true },
        paddingRight: { type: "number", description: "Right padding value for auto-layout frame", nullable: true },
        paddingBottom: { type: "number", description: "Bottom padding value for auto-layout frame", nullable: true },
        paddingLeft: { type: "number", description: "Left padding value for auto-layout frame", nullable: true },
        primaryAxisAlignItems: { type: "string", enum: ["MIN", "MAX", "CENTER", "SPACE_BETWEEN"], description: "Primary axis alignment for auto-layout frame", nullable: true },
        counterAxisAlignItems: { type: "string", enum: ["MIN", "MAX", "CENTER", "BASELINE"], description: "Counter axis alignment for auto-layout frame", nullable: true },
        layoutSizingHorizontal: { type: "string", enum: ["FIXED", "HUG", "FILL"], description: "Horizontal sizing mode for auto-layout frame", nullable: true },
        layoutSizingVertical: { type: "string", enum: ["FIXED", "HUG", "FILL"], description: "Vertical sizing mode for auto-layout frame", nullable: true },
        itemSpacing: { type: "number", description: "Distance between children in auto-layout frame", nullable: true },
      },
      required: ["x", "y", "width", "height", "name"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_text",
    description: "Create a new text node with customizable content, typography, alignment and styling options.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        text: { type: "string", description: "Text content of the node" },
        name: { type: "string", description: "Semantic name for the node" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        fontSize: { type: "number", description: "Text font size (default: 14)", nullable: true },
        fontWeight: { type: "number", minimum: 100, maximum: 900, description: "Text font weight in numeric value", nullable: true },
        fontColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Text color (RGBA)",
          nullable: true
        },
        textAlignHorizontal: { type: "string", enum: ["LEFT", "CENTER", "RIGHT", "JUSTIFIED"], description: "Horizontal text alignment (Default value: LEFT)", nullable: true },
        textAlignVertical: { type: "string", enum: ["TOP", "CENTER", "BOTTOM"], description: "Vertical text alignment (Default value: TOP)", nullable: true },
        parentId: { type: "string", description: "FRAME | GROUP | SECTION ID to append the node to", nullable: true },
      },
      required: ["x", "y", "text", "name", "width", "height"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_graphic",
    description: "Create a new vector graphic node from SVG markup for icons and scalable illustrations.",
    parameters: {
      type: "object",
      properties: {
        svg: { type: "string", description: "The raw SVG markup as a string" },
        name: { type: "string", description: "A semantic name for the vector graphic node" },
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
      },
      required: ["svg", "name", "x", "y"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_ellipse",
    description: "Create a new elliptical or circular shape node with customizable fill and stroke properties.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        name: { type: "string", description: "Semantic name for the node" },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
        fillColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Fill color of the node in RGBA format",
          nullable: true
        },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color of the node in RGBA format",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight of the node in pixel value", nullable: true },
      },
      required: ["x", "y", "width", "height", "name"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_polygon",
    description: "Create a new polygon shape with configurable number of sides and styling.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        pointCount: { type: "integer", minimum: 3, description: "Number of sides of the polygon (integer ≥ 3)" },
        name: { type: "string", description: "Semantic name for the node" },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
        fillColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Fill color of the node in RGBA format",
          nullable: true
        },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color of the node in RGBA format",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight of the node in pixel value", nullable: true },
      },
      required: ["x", "y", "width", "height", "pointCount", "name"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_star",
    description: "Create a new star shape with customizable points, inner radius, and styling properties.",
    parameters: {
      type: "object",
      properties: {
        x: { type: "number", description: "X coordinate of the node (global)" },
        y: { type: "number", description: "Y coordinate of the node (global)" },
        width: { type: "number", description: "Width of the node" },
        height: { type: "number", description: "Height of the node" },
        name: { type: "string", description: "Semantic name for the node", nullable: true },
        pointCount: { type: "integer", minimum: 3, maximum: 60, description: "Number of star points" },
        innerRadius: { type: "number", minimum: 0, maximum: 100, description: "Inner radius as % of diameter", nullable: true },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
        fillColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Fill color of the node in RGBA format",
          nullable: true
        },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color of the node in RGBA format",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight of the node in pixel value", nullable: true },
      },
      required: ["x", "y", "width", "height", "pointCount"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_line",
    description: "Create a new line element between two points with customizable stroke styling and end caps.",
    parameters: {
      type: "object",
      properties: {
        startX: { type: "number", description: "Start point (X coordinate)" },
        startY: { type: "number", description: "Start point (Y coordinate)" },
        endX: { type: "number", description: "End point (X coordinate)" },
        endY: { type: "number", description: "End point (Y coordinate)" },
        name: { type: "string", description: "Semantic name for the node" },
        parentId: { type: "string", description: "A parent node (FRAME, GROUP, and SECTION type only) ID to append the node to", nullable: true },
        strokeColor: {
          type: "object",
          properties: {
            r: { type: "number", minimum: 0, maximum: 1 },
            g: { type: "number", minimum: 0, maximum: 1 },
            b: { type: "number", minimum: 0, maximum: 1 },
            a: { type: "number", minimum: 0, maximum: 1, nullable: true },
          },
          required: ["r", "g", "b"],
          description: "Stroke color of the node in RGBA format",
          nullable: true
        },
        strokeWeight: { type: "number", minimum: 0, description: "Stroke weight of the node in pixel value", nullable: true },
        strokeCap: { type: "string", enum: ["NONE", "ROUND", "SQUARE"], description: "Line-end cap style (e.g., NONE, ROUND, or SQUARE)", nullable: true },
        dashPattern: { type: "array", items: { type: "number", minimum: 0 }, minItems: 2, maxItems: 2, description: "[dash, gap] in px (e.g., [4, 2] for a dashed line)", nullable: true },
      },
      required: ["startX", "startY", "endX", "endY", "name"],
      additionalProperties: false
    },
    strict: true
  },
  {
    type: "function",
    name: "create_mask",
    description: "Create a mask group by combining a mask node with content nodes to apply clipping effects.",
    parameters: {
      type: "object",
      properties: {
        maskNodeId: { type: "string", description: "Node ID to use as a mask" },
        contentNodeIds: { type: "array", items: { type: "string" }, minItems: 1, description: "IDs of nodes masked by the mask node" },
        groupName: { type: "string", description: "Semantic name for the mask group", nullable: true },
      },
      required: ["maskNodeId", "contentNodeIds"],
      additionalProperties: false
    },
    strict: true
  },
];
