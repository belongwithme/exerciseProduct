-- Epic 3: Advanced Workout Logging
-- Task 3.1 (BE): Create a new Supabase RPC function for "one-click copy last workout".
-- This function takes a historical workout log ID and returns a JSON template
-- containing the exercises and set details from that log, which can be used to
-- pre-populate a new workout log form.

-- Drop both potential versions of the function to handle migration inconsistencies
DROP FUNCTION IF EXISTS copy_workout_from_log(bigint);
DROP FUNCTION IF EXISTS copy_workout_from_log(uuid);

-- Create the RPC function
CREATE OR REPLACE FUNCTION copy_workout_from_log(previous_log_id uuid)
-- The function returns a JSON object which is easy for the frontend to parse.
RETURNS json
-- SECURITY DEFINER allows the function to be executed with the privileges of the user who defines it,
-- which is necessary to bypass RLS policies temporarily within the function,
-- after we have already performed our own security check.
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  -- Variable to hold the resulting JSON
  result json;
  -- Variable to check if the user has access to the log
  log_owner_id uuid;
BEGIN
  -- Security check: Ensure the user requesting the copy owns the source log.
  -- The `auth.uid()` function gets the ID of the currently authenticated user.
  SELECT user_id INTO log_owner_id FROM workout_logs WHERE id = previous_log_id;

  IF log_owner_id != auth.uid() THEN
    -- If the user doesn't own the log, return an error message in JSON format.
    RETURN json_build_object('error', 'You do not have permission to copy this workout log.');
  END IF;

  -- If the security check passes, proceed to build the workout template.
  -- This query aggregates data from `logged_sets` for the given `previous_log_id`.
  SELECT
    json_agg(
      json_build_object(
        'exercise_id', t.exercise_id,
        'name', e.name, -- Joins with 'exercises' table to get the name
        'muscle_group', e.muscle_group,
        'equipment', e.equipment,
        'sets', t.sets
      )
    )
  INTO result
  FROM (
    -- Subquery: Group all sets by the exercise ID
    SELECT
      ls.exercise_id,
      -- This aggregates all individual sets for an exercise into a JSON array.
      json_agg(
        json_build_object(
          'set_number', ls.set_number,
          'reps', ls.reps,
          'weight_kg', ls.weight_kg,
          'notes', ls.notes
        ) ORDER BY ls.set_number
      ) AS sets
    FROM logged_sets AS ls
    WHERE ls.log_id = previous_log_id
    GROUP BY ls.exercise_id
  ) AS t
  -- Join with the `exercises` table to include details like the exercise name.
  JOIN exercises e ON t.exercise_id = e.id;

  -- Return the final JSON object. If no records were found, it will return NULL,
  -- which the frontend should handle.
  RETURN result;
END;
$$; 