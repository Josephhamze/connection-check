import { describe, expect, it } from "vitest";
import { normalizeMessage } from "./messages";

describe("normalizeMessage", () => {
  it("trims a valid message", () => {
    expect(normalizeMessage("  Connected from Codex  ")).toBe("Connected from Codex");
  });

  it("rejects an empty message", () => {
    expect(() => normalizeMessage("   ")).toThrow("Enter a message");
  });

  it("rejects messages longer than 160 characters", () => {
    expect(() => normalizeMessage("x".repeat(161))).toThrow("160 characters or fewer");
  });
});
