import express from "express";
import userRouter from "./routes/user.router.js";

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.getconnection();
    this.middlewares();
    this.routes();
  }

  getconnection() {}
  middlewares() {
    this.app.use(express.json());
  }
  routes() {
    this.app.use("/api/users", userRouter);
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
