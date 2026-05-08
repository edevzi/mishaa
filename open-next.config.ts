const config = {
  default: {
    // Minifying the traced server bundle breaks OpenNext's @vercel/og patch (invalid
    // `export { ImageResponse }` after fallbackFont rewrite). Keep minify off until
    // https://github.com/opennextjs/opennextjs-cloudflare fixes that interaction.
    minify: false,
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  cloudflare: {
    useWorkerdCondition: true,
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
