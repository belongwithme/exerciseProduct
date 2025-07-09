import { j as json } from "../../../../chunks/index2.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
const GET = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session?.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = session;
  try {
    const { data: lastWorkout, error } = await supabase.from("workout_logs").select("date").eq("user_id", user.id).order("date", { ascending: false }).limit(1).single();
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching last workout date:", error);
      return json({ error: "Failed to fetch last workout date" }, { status: 500 });
    }
    return json({
      success: true,
      last_workout_date: lastWorkout?.date || null,
      has_workouts: !!lastWorkout
    });
  } catch (error) {
    console.error("Last workout API error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
export {
  GET
};
