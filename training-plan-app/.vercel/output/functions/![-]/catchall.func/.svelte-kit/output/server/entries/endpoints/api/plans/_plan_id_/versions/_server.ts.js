import { e as error, j as json } from "../../../../../../chunks/index2.js";
const GET = async ({ locals: { supabase }, params }) => {
  const { plan_id } = params;
  if (!plan_id) {
    throw error(400, "必须提供训练计划ID (Plan ID is required)");
  }
  const { data: planData, error: planError } = await supabase.from("workout_plans").select("id").eq("id", plan_id).single();
  if (planError || !planData) {
    throw error(404, "找不到指定的训练计划，或当前用户无权访问。");
  }
  const { data, error: versionsError } = await supabase.from("workout_plan_versions").select("id, version_number, created_at").eq("plan_id", plan_id).order("version_number", { ascending: false });
  if (versionsError) {
    console.error("Error fetching workout plan versions:", versionsError);
    throw error(500, `获取训练计划版本历史时发生错误: ${versionsError.message}`);
  }
  return json(data);
};
export {
  GET
};
