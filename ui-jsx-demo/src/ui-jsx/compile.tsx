import React from "react";
import { parse } from "@babel/parser";
import { registry, type ComponentName } from "./components";

// Parses an LLM-emitted JSX string and returns a React element.
// Throws if the JSX uses unknown components, expressions, imports, or fragments.

export function compile(jsx: string): React.ReactElement {
  const trimmed = jsx.trim();
  const ast = parse(`<>${trimmed}</>`, {
    plugins: ["jsx"],
    sourceType: "module",
  });

  const program = ast.program.body[0];
  if (program.type !== "ExpressionStatement") {
    throw new Error("Expected JSX expression");
  }
  const fragment = program.expression;
  if (fragment.type !== "JSXFragment") {
    throw new Error("Expected JSX fragment wrapper");
  }

  const roots = fragment.children.filter(
    (c) => c.type === "JSXElement"
  );
  if (roots.length !== 1) {
    throw new Error(`Expected exactly 1 root element, got ${roots.length}`);
  }

  return renderNode(roots[0] as any, 0);
}

function renderNode(node: any, key: number): React.ReactElement {
  if (node.type !== "JSXElement") {
    throw new Error(`Unexpected node type: ${node.type}`);
  }

  const name = node.openingElement.name.name as string;
  if (!(name in registry)) {
    throw new Error(`Unknown component: <${name}>`);
  }

  const Component = registry[name as ComponentName] as React.ComponentType<any>;
  const props = extractProps(node.openingElement.attributes);
  const children = node.children
    .map((child: any, i: number) => renderChild(child, i))
    .filter((c: any) => c !== null);

  return React.createElement(
    Component,
    { ...props, key },
    children.length ? children : undefined
  );
}

function renderChild(child: any, key: number): React.ReactNode {
  if (child.type === "JSXText") {
    const text = child.value.replace(/\s+/g, " ").trim();
    return text || null;
  }
  if (child.type === "JSXElement") {
    return renderNode(child, key);
  }
  if (child.type === "JSXFragment") {
    throw new Error("Fragments are not allowed");
  }
  if (child.type === "JSXExpressionContainer") {
    throw new Error("Expressions are not allowed in children");
  }
  return null;
}

function extractProps(attrs: any[]): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attr of attrs) {
    if (attr.type !== "JSXAttribute") {
      throw new Error("Spread props are not allowed");
    }
    const name = attr.name.name as string;
    const value = attr.value;

    if (value === null) {
      props[name] = true;
    } else if (value.type === "StringLiteral") {
      props[name] = value.value;
    } else if (value.type === "JSXExpressionContainer") {
      const expr = value.expression;
      if (expr.type === "StringLiteral") props[name] = expr.value;
      else if (expr.type === "NumericLiteral") props[name] = expr.value;
      else if (expr.type === "BooleanLiteral") props[name] = expr.value;
      else throw new Error(`Disallowed expression in prop "${name}"`);
    } else {
      throw new Error(`Unsupported attribute value for "${name}"`);
    }
  }
  return props;
}
