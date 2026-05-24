import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * ファイルウォッチが OS の上限（macOS で EMFILE）に達する環境向け。
   * macOS ではデフォルトでポーリング監視。他 OS では NEXT_WEBPACK_POLL=1 のときのみ。
   */
  webpack: (config, { dev }) => {
    const usePoll =
      dev &&
      (process.platform === "darwin" || process.env.NEXT_WEBPACK_POLL === "1");
    if (usePoll) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
