import sqlite from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";

const sqlite3 = sqlite.verbose();

const DB_NAME = "database.sqlite";

async function openDb() {
  return open({
    filename: DB_NAME,
    driver: sqlite3.Database,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await openDb();

  if (req.method === "DELETE") {
    const { id } = req.query
    await db.run("DELETE FROM todos WHERE id = ?", id);
    res.status(204).end();
  }

  await db.close();
}
