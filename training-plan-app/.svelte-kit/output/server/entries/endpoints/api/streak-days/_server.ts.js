import { j as json } from "../../../../chunks/index2.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
const GET = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session?.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = session;
  try {
    const { data: streakData, error: rpcError } = await supabase.rpc("get_streak_days", { user_id: user.id });
    if (!rpcError && streakData !== null) {
      return json({
        success: true,
        streak_days: streakData,
        source: "rpc_function"
      });
    }
    console.log("RPC函数不存在，使用客户端计算:", rpcError);
    const { data: logs, error: logsError } = await supabase.from("workout_logs").select("date").eq("user_id", user.id).order("date", { ascending: false });
    if (logsError) {
      console.error("Error fetching workout logs for streak calculation:", logsError);
      return json({ error: "Failed to calculate streak days" }, { status: 500 });
    }
    const streakDays = calculateStreakDays(logs || []);
    return json({
      success: true,
      streak_days: streakDays,
      source: "client_calculation"
    });
  } catch (error) {
    console.error("Streak days API error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
function calculateStreakDays(logs) {
  if (logs.length === 0) {
    return 0;
  }
  const uniqueDates = [...new Set(logs.map((log) => log.date))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  if (uniqueDates.length === 0) {
    return 0;
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
  let streakDays = 0;
  let currentDate = /* @__PURE__ */ new Date();
  if (uniqueDates[0] === today) {
    streakDays = 1;
    currentDate = new Date(today);
  } else if (uniqueDates[0] === yesterday) {
    streakDays = 1;
    currentDate = new Date(yesterday);
  } else {
    return 0;
  }
  for (let i = 1; i < uniqueDates.length; i++) {
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);
    const expectedDateString = expectedDate.toISOString().split("T")[0];
    if (uniqueDates[i] === expectedDateString) {
      streakDays++;
      currentDate = expectedDate;
    } else {
      break;
    }
  }
  return streakDays;
}
export {
  GET
};
