import { describe, expect, it } from "vitest";
import { parseEntry } from "../markdown";

describe("parseEntry", () => {
  it("Empty entry", () => {
    expect(parseEntry("")).toBe(null);
  });

  it("Simple link", () => {
    expect(parseEntry("- [title](http://example.com)")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "",
      tags: [],
    });
  });

  it("Link with description", () => {
    expect(parseEntry("- [title](http://example.com) details")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: [],
    });
  });

  it("Link with longer description", () => {
    expect(parseEntry("- [title](http://example.com) details and more details")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "details and more details",
      tags: [],
    });
  });

  it("Link with tags", () => {
    expect(parseEntry("- [title](http://example.com) #tag")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "",
      tags: ["tag"],
    });
  });

  it("Link with multiple tags", () => {
    expect(parseEntry("- [title](http://example.com) #tag1#tag2")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything", () => {
    expect(parseEntry("- [title](http://example.com) details #tag1#tag2")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything and additional whitespace", () => {
    expect(parseEntry("- [title](http://example.com)      details  #tag1#tag2  ")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });

  it("Link with everything and lack of whitespace", () => {
    expect(parseEntry("- [title](http://example.com)details#tag1#tag2")).toEqual({
      title: "title",
      href: "http://example.com",
      description: "details",
      tags: ["tag1", "tag2"],
    });
  });
});
