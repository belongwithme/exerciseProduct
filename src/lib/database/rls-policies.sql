DROP POLICY IF EXISTS "Authenticated users can view all exercises" ON public.exercises;
DROP POLICY IF EXISTS "Anyone can view system exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can view own exercises" ON public.exercises;

CREATE POLICY "Public can view all exercises" ON public.exercises
    FOR SELECT USING (true);

CREATE POLICY "Users can create exercises" ON public.exercises
    FOR INSERT WITH CHECK (created_by = auth.uid());