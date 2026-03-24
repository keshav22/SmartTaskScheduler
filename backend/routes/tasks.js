// backend/routes/tasks.js

import supabase from "../config/supabaseClient.js"

app.get("/tasks", async (req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")

  res.json(data)
})