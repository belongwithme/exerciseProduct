import { e as error, j as json } from "../../../../../../../chunks/index2.js";
const GET = async ({ locals: { supabase }, params }) => {
  const { plan_id, version_number } = params;
  if (!plan_id || !version_number) {
    throw error(400, "必须提供训练计划ID和版本号 (Plan ID and Version Number are required)");
  }
  const versionNum = parseInt(version_number, 10);
  if (isNaN(versionNum)) {
    throw error(400, "版本号必须是有效的数字 (Version number must be a valid number)");
  }
  const { data: planData, error: planError } = await supabase.from("workout_plans").select("id").eq("id", plan_id).single();
  if (planError || !planData) {
    throw error(404, "找不到指定的训练计划，或当前用户无权访问。");
  }
  const { data, error: versionError } = await supabase.from("workout_plan_versions").select("content").eq("plan_id", plan_id).eq("version_number", versionNum).single();
  if (versionError || !data) {
    console.error("Error fetching workout plan version:", versionError);
    throw error(404, `找不到计划 ${plan_id} 的版本 ${version_number}。`);
  }
  return json(data.content);
};
export {
  GET
};
