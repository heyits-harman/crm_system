import express from "express";
import authValidation from "./middleware/auth";
import userRoutes from "./route/userRoutes";
import leadsRoutes from "./route/leadsRoutes";
import dashboardRoutes from "./route/dashboardRoute";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/leads", authValidation, leadsRoutes);
app.use("/dashboard", authValidation, dashboardRoutes);

export default app;