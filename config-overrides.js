const { override, addLessLoader, adjustStyleLoaders } = require('customize-cra');

module.exports = override(
    adjustStyleLoaders(({ use: [ , css, postcss, resolve, processor] }) => {
        if (postcss) {
            postcss.options.postcssOptions = {
            plugins: [
                require('autoprefixer')(),
                // 添加你需要的其他插件
            ],
            };
        }
        }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
);