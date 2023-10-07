import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { parseEntry } from "../markdown";

describe("parseEntry", () => {
  it("Empty entry", () => {
    strictEqual(parseEntry(""), null);
  });

  it("Simple link", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com)"), {
      title: "title",
      href: "http://example.com",
      description: "",
      tags: [],
    });
  });

  it("Link with description", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com) details"), {
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: [],
    });
  });

  it("Link with longer description", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com) details and more details"), {
      title: "title",
      href: "http://example.com",
      description: "details and more details",
      tags: [],
    });
  });

  it("Link with tags", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com) #tag"), {
      title: "title",
      href: "http://example.com",
      description: "",
      tags: ["tag"],
    });
  });

  it("Link with multiple tags", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com) #tag1#tag2"), {
      title: "title",
      href: "http://example.com",
      description: "",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com) details #tag1#tag2"), {
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything and additional whitespace", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com)      details  #tag1#tag2  "), {
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything and lack of whitespace", () => {
    deepStrictEqual(parseEntry("- [title](http://example.com)details#tag1#tag2"), {
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });
});
