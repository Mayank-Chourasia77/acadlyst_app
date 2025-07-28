
-- This function calculates statistics for each course,
-- including the total number of resources and a list of popular subjects.
CREATE OR REPLACE FUNCTION get_course_stats()
RETURNS TABLE(
  course_name TEXT,
  resource_count BIGINT,
  popular_subjects TEXT[]
)
LANGUAGE sql
AS $$
  WITH course_subject_counts AS (
    SELECT
      course,
      subject,
      COUNT(*) as subject_count,
      ROW_NUMBER() OVER(PARTITION BY course ORDER BY COUNT(*) DESC) as rn
    FROM public.uploads
    WHERE is_hidden = false AND course IS NOT NULL
    GROUP BY course, subject
  ),
  aggregated_subjects AS (
    SELECT
      course,
      array_agg(subject) as subjects
    FROM course_subject_counts
    WHERE rn <= 4
    GROUP BY course
  )
  SELECT
    t.course,
    t.resource_count,
    COALESCE(asub.subjects, ARRAY[]::TEXT[]) as popular_subjects
  FROM (
    SELECT
      course,
      COUNT(id) as resource_count
    FROM public.uploads
    WHERE is_hidden = false AND course IS NOT NULL
    GROUP BY course
  ) t
  LEFT JOIN aggregated_subjects asub ON t.course = asub.course
  ORDER BY t.resource_count DESC;
$$;
