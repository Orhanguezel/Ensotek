// src/core/utils/testApp.ts
import express from "express";
import newsRouter from "@/modules/news";
import authRouter from "@/modules/users"; // 👈 ekle!

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/news", newsRouter);
app.use("/auth", authRouter); // ✅ login route erişimi için şart

export default app;
