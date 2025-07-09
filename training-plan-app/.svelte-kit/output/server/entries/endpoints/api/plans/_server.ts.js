import { j as json } from "../../../../chunks/index2.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
const GET = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session?.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = session;
  const { data: plans, error } = await supabase.from("workout_plans").select(`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                notes,
                exercises (
                    name,
                    muscle_group,
                    equipment
                )
            )
        `).eq("user_id", user.id);
  if (error) {
    console.error("Error fetching workout plans:", error);
    return json({ error: "Failed to fetch workout plans" }, { status: 500 });
  }
  return json(plans);
};
const POST = async ({ request, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session?.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const { user } = session;
  const { name, description, exercises } = await request.json();
  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    return json({ error: "Invalid input: name and at least one exercise are required." }, { status: 400 });
  }
  const { data: planData, error: planError } = await supabase.from("workout_plans").insert({
    user_id: user.id,
    name,
    description
  }).select().single();
  if (planError) {
    console.error("Error creating workout plan:", planError);
    return json({ error: "Failed to create workout plan" }, { status: 500 });
  }
  const planId = planData.id;
  const exercisesToInsert = exercises.map((ex, index) => ({
    plan_id: planId,
    exercise_id: ex.exercise_id,
    target_sets: ex.target_sets || 3,
    target_reps: ex.target_reps || 12,
    target_weight_kg: ex.target_weight_kg || null,
    rest_seconds: ex.rest_seconds || null,
    exercise_order: ex.exercise_order || index + 1,
    week_number: ex.week_number || null,
    day_of_week: ex.day_of_week || 1,
    notes: ex.notes || null
  }));
  const { error: exercisesError } = await supabase.from("plan_exercises").insert(exercisesToInsert);
  if (exercisesError) {
    console.error("Error adding exercises to plan:", exercisesError);
    await supabase.from("workout_plans").delete().eq("id", planId);
    return json({ error: "Failed to add exercises to the plan" }, { status: 500 });
  }
  const { data: newPlan, error: newPlanError } = await supabase.from("workout_plans").select(`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                notes,
                exercises (
                    name
                )
            )
        `).eq("id", planId).single();
  if (newPlanError) {
    console.error("Error fetching newly created plan:", newPlanError);
    return json({ error: "Plan created, but failed to fetch final data." }, { status: 500 });
  }
  return json(newPlan, { status: 201 });
};
export {
  GET,
  POST
};
