import express from "express";
import authValidation from "./middleware/auth";
import userRoutes from "./route/userRoutes";
import leadsRoutes from "./route/leadsRoutes";
import dashboardRoutes from "./route/dashboardRoute";

const app = express();

app.use(express.json());

// Enable CORS for frontend integration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/users", userRoutes);
app.use("/leads", leadsRoutes);
app.use("/dashboard", authValidation, dashboardRoutes);

export default app;