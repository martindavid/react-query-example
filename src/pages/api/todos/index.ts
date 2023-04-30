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

  if (req.method === "GET") {
    const todos = await db.all("SELECT * FROM todos");
    res.status(200).json(todos);
  } else if (req.method === "POST") {
    console.log({ body: req.body })
    const { text } = JSON.parse(req.body);
    const id = uuidv4();
    await db.run("INSERT INTO todos (id, text) VALUES (?, ?)", id, text);
    const todo = { id, text, isCompleted: false };
    res.status(201).json(todo);
  } else if (req.method === "PUT") {
    const { id, text, isCompleted } = req.body;
    await db.run(
      "UPDATE todos SET text = ?, isCompleted = ? WHERE id = ?",
      text,
      isCompleted,
      id
    );
    const updatedTodo = { id, text, isCompleted };
    res.status(200).json(updatedTodo);
  }

  await db.close();
}
