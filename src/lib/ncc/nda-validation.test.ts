import { describe, it as test } from "node:test";
import { throws, doesNotThrow } from "node:assert/strict";
import { assertAllNdaMembers } from "./nda-validation";

describe("NDA de todos los integrantes", () => {
  const members = ["Ana María", "Luis Gómez", "Juan Pérez", "Sara Díaz"];
  test("no permite entregar con un integrante sin comprobante", () => {
    throws(() => assertAllNdaMembers(members, members.slice(0, 3)));
  });
  test("no permite duplicar un integrante para reemplazar otro", () => {
    throws(() => assertAllNdaMembers(members, [members[0], members[1], members[2], members[2]]));
  });
  test("permite comprobantes individuales de todos, sin depender del orden o las tildes", () => {
    doesNotThrow(() => assertAllNdaMembers(members, ["Sara Diaz", "JUAN PEREZ", "Luis Gomez", "Ana Maria"]));
  });
});