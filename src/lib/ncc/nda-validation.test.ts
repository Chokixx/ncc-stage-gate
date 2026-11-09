/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { assertAllNdaMembers } from "./nda-validation";

describe("NDA de todos los integrantes", () => {
  const members = ["Ana María", "Luis Gómez", "Juan Pérez", "Sara Díaz"];
  test("no permite entregar con un integrante sin comprobante", () => {
    expect(() => assertAllNdaMembers(members, members.slice(0, 3))).toThrow();
  });
  test("no permite duplicar un integrante para reemplazar otro", () => {
    expect(() => assertAllNdaMembers(members, [members[0], members[1], members[2], members[2]])).toThrow();
  });
  test("permite comprobantes individuales de todos, sin depender del orden o las tildes", () => {
    expect(() => assertAllNdaMembers(members, ["Sara Diaz", "JUAN PEREZ", "Luis Gomez", "Ana Maria"])).not.toThrow();
  });
});