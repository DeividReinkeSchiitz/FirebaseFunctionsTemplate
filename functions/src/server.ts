import * as functions from "firebase-functions";
import * as helmet from "helmet";
import * as express from "express";
import * as cors from "cors";
import router from "./router";

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
  }
  private middlewares() {
    this.connect();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(router);
  }

  private connect() {
    require("./config/firebaseConfig");
  }

  public start() {
    this.app.listen(2323, () => {
      console.log("sever running in port: " +2323);
    });
  }
  public functions() {
    return functions.https.onRequest(this.app);
  }
}

export default Server;
