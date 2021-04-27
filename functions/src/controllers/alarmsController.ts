import {Request, Response} from "express";
import admin from "../config/firebaseConfig";

export type AlarmType = {
  time: string;
  name: string;
  repeted: string[] | "Uma vez" | "Diáriamente" | "Seg à Sex";
  enabled: boolean;
}


async function _isSigned(uid:string) {
  const auth = await admin
      .auth()
      .getUser(uid);

  return auth;
}


export default {
  async show(req: Request, res: Response) {
    try {
      const {uid} = req.body;

      if (!(await _isSigned(uid))) return;

      const db = admin.firestore();

      const snapshot = await db.collection("users").
          doc(uid).collection("alarms").get();

      const alarmes: Array<any> = [];

      snapshot.forEach((doc) => {
        alarmes.push({...doc.data(), id: doc.id});
      });
      res.json(alarmes);
    } catch (error) {
      res.json(error.message);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {time, name, repeted, uid} = req.body;
      if (!(await _isSigned(uid))) return;


      const db = admin.firestore();
      const alarmsCollection = await db.collection("users").
          doc(uid).collection("alarms");

      await alarmsCollection.add({
        time, enabled: true, name, repeted,
      });

      res.json({
        time, enabled: true, name, repeted,
      });
    } catch (error) {
      res.json(error.message);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const {ids, uid} = req.body;
      if (!(await _isSigned(uid))) return;

      const db = admin.firestore();
      const alarmsCollection = await db.collection("users").
          doc(uid).collection("alarms");

      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];

        await alarmsCollection.doc(id).delete();
      }

      res.json(ids);
    } catch (error) {
      res.json(error.message);
    }
  },
  async update(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const {uid} = req.body;

      if (!(await _isSigned(uid))) return;

      const db = admin.firestore();
      const alarmsCollection = await db.collection("users").
          doc(uid).collection("alarms");

      const currentAlarm = await alarmsCollection.doc(id);
      const alarmUpdated = await currentAlarm
          .update({enabled: req.body?.enabled});

      res.json(alarmUpdated);
    } catch (error) {
      res.json(error.message);
    }
  },
};
