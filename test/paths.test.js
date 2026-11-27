import assert from "node:assert/strict";
import test from "node:test";

import {
  bindHost,
  clientHost,
  extraAllowedHosts,
  hostForUrl,
  LOOPBACK_HOST,
  linkHost,
  publicOrigin,
} from "../src/paths.js";

test("bindHost defaults to loopback and honors ACRYLAXI_HOST", () => {
  assert.equal(bindHost({}), LOOPBACK_HOST);
  assert.equal(bindHost({ ACRYLAXI_HOST: "" }), LOOPBACK_HOST);
  assert.equal(bindHost({ ACRYLAXI_HOST: "  " }), LOOPBACK_HOST);
  assert.equal(bindHost({ ACRYLAXI_HOST: "100.64.0.1" }), "100.64.0.1");
  assert.equal(bindHost({ ACRYLAXI_HOST: " 0.0.0.0 " }), "0.0.0.0");
});

test("clientHost dials the concrete primary listener for wildcard binds", () => {
  assert.equal(clientHost({}), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "100.64.0.1" }), "100.64.0.1");
  assert.equal(clientHost({ ACRYLAXI_HOST: "0.0.0.0" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "::" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "[::]" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "0:0:0:0:0:0:0:0" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "[0:0:0:0:0:0:0:0]" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ACRYLAXI_HOST: "::ffff:0.0.0.0" }), LOOPBACK_HOST);
});

test("extraAllowedHosts parses the whitespace-separated opt-in list", () => {
  assert.deepEqual(extraAllowedHosts({}), []);
  assert.deepEqual(extraAllowedHosts({ ACRYLAXI_ALLOWED_HOSTS: "" }), []);
  assert.deepEqual(extraAllowedHosts({ ACRYLAXI_ALLOWED_HOSTS: "  " }), []);
  assert.deepEqual(extraAllowedHosts({ ACRYLAXI_ALLOWED_HOSTS: "proxy.example" }), ["proxy.example"]);
  assert.deepEqual(extraAllowedHosts({ ACRYLAXI_ALLOWED_HOSTS: "  a.example   b.example\tc.example  " }), [
    "a.example",
    "b.example",
    "c.example",
  ]);
  assert.deepEqual(extraAllowedHosts({ ACRYLAXI_ALLOWED_HOSTS: "*" }), ["*"]);
});

test("linkHost prefers ACRYLAXI_LINK_HOST, then falls back to the dial host", () => {
  assert.equal(linkHost({}), LOOPBACK_HOST);
  assert.equal(linkHost({ ACRYLAXI_LINK_HOST: "host.example" }), "host.example");
  assert.equal(linkHost({ ACRYLAXI_LINK_HOST: "  " }), LOOPBACK_HOST);
  // Non-wildcard bind with no explicit link host -> links reuse the bind address.
  assert.equal(linkHost({ ACRYLAXI_HOST: "100.64.0.1" }), "100.64.0.1");
  // Wildcard bind with an explicit link host -> links use the hostname, not 0.0.0.0.
  assert.equal(linkHost({ ACRYLAXI_HOST: "0.0.0.0", ACRYLAXI_LINK_HOST: "host.example" }), "host.example");
  // IPv6 wildcard bind with no explicit link host -> links use the concrete loopback listener.
  assert.equal(linkHost({ ACRYLAXI_HOST: "::" }), LOOPBACK_HOST);
});

test("publicOrigin accepts only http(s) origins and normalizes their authority", () => {
  assert.equal(publicOrigin({}), null);
  assert.equal(publicOrigin({ ACRYLAXI_PUBLIC_URL: "  " }), null);
  for (const [value, expected] of [
    [" https://Acrylaxi.Example.test/ ", "https://acrylaxi.example.test"],
    ["https://acrylaxi.example.test:443", "https://acrylaxi.example.test"],
    ["http://acrylaxi.example.test:8080", "http://acrylaxi.example.test:8080"],
    ["https://[fd00::1]:8443", "https://[fd00::1]:8443"],
  ]) {
    assert.equal(publicOrigin({ ACRYLAXI_PUBLIC_URL: value }), expected);
  }
  for (const value of [
    "acrylaxi.example.test",
    "ftp://acrylaxi.example.test",
    "https:acrylaxi.example.test",
    "https://user:password@acrylaxi.example.test",
    "https://@acrylaxi.example.test",
    "https://acrylaxi.example.test/sub",
    "https://acrylaxi.example.test/sub/..",
    "https://acrylaxi.example.test?a=1",
    "https://acrylaxi.example.test?",
    "https://acrylaxi.example.test#x",
    "https://acrylaxi.example.test#",
    "http://0.0.0.0",
    "http://[::]",
    "http://[::ffff:0.0.0.0]",
    "http://*.example.test",
    "https://acrylaxi.\nexample.test",
    "https://acrylaxi.example.test\\sub",
  ]) {
    assert.throws(
      () => publicOrigin({ ACRYLAXI_PUBLIC_URL: value }),
      /ACRYLAXI_PUBLIC_URL must be an http\(s\) origin/,
    );
  }
});

test("hostForUrl brackets IPv6 literals but leaves IPv4 and hostnames alone", () => {
  assert.equal(hostForUrl("127.0.0.1"), "127.0.0.1");
  assert.equal(hostForUrl("host.example"), "host.example");
  assert.equal(hostForUrl("::1"), "[::1]");
  assert.equal(hostForUrl("[::1]"), "[::1]");
});
