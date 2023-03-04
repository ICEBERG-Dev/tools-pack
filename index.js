function sayHello() {
  return process.env.SECRET_KEY || "hey!";
}

module.exports = { sayHello };
