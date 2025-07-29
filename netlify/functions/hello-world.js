// Example serverless function: netlify/functions/hello-world.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from the serverless world!",
      timestamp: new Date().toISOString(),
    }),
  };
};
