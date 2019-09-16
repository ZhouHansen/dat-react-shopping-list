module.exports = {
  modify: config => {
    config.node = { fs: "empty" };
    return config;
  }
};
