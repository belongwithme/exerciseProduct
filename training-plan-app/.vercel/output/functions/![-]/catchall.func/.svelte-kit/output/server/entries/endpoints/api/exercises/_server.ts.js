import { j as json } from "../../../../chunks/index2.js";
const GET = async ({ url, locals: { supabase } }) => {
  const searchParams = url.searchParams;
  const muscle_group = searchParams.get("muscle_group");
  const equipment = searchParams.get("equipment");
  const difficulty_level = searchParams.get("difficulty_level");
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  let query = supabase.from("exercises").select(`
			id,
			name,
			description,
			muscle_group,
			equipment,
			difficulty_level,
			type,
			video_url,
			image_url,
			instructions,
			tips,
			is_system_exercise
		`, { count: "exact" }).order("name", { ascending: true });
  if (muscle_group) {
    query = query.eq("muscle_group", muscle_group);
  }
  if (equipment) {
    query = query.eq("equipment", equipment);
  }
  if (difficulty_level) {
    query = query.eq("difficulty_level", difficulty_level);
  }
  if (type) {
    query = query.eq("type", type);
  }
  query = query.range(offset, offset + limit - 1);
  const { data: exercises, error, count } = await query;
  if (error) {
    console.error("获取训练动作失败:", error);
    return json({ error: "获取训练动作失败" }, { status: 500 });
  }
  const { data: filterOptions, error: filterError } = await supabase.from("exercises").select("muscle_group, equipment, difficulty_level, type").not("muscle_group", "is", null).not("equipment", "is", null);
  let uniqueOptions = {};
  if (!filterError && filterOptions) {
    uniqueOptions = {
      muscle_groups: [...new Set(filterOptions.map((ex) => ex.muscle_group).filter(Boolean))].sort(),
      equipment: [...new Set(filterOptions.map((ex) => ex.equipment).filter(Boolean))].sort(),
      difficulty_levels: [...new Set(filterOptions.map((ex) => ex.difficulty_level).filter(Boolean))].sort(),
      types: [...new Set(filterOptions.map((ex) => ex.type).filter(Boolean))].sort()
    };
  }
  return json({
    exercises,
    total: count,
    limit,
    offset,
    filterOptions: uniqueOptions
  });
};
export {
  GET
};
