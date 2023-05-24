module.exports = {
  apps: [
    {
      name: "Crunch Bot",
      script: "dist/index.js",
      exec_mode: "cluster",
      instances: 1,
      wait_ready: true,
      listen_timeout: 5000,
      watch: ["./dist"],
    },
  ],
};
