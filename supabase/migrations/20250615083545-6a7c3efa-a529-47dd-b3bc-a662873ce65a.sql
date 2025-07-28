
CREATE OR REPLACE FUNCTION get_top_creators(content_type text, limit_count integer)
RETURNS TABLE(user_id uuid, user_name text, username text, total_uploads bigint, total_votes bigint, badge_count bigint)
AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT
      u.id,
      u.name,
      u.username,
      COUNT(up.id) FILTER (WHERE up.is_hidden = false AND (content_type IS NULL OR up.type::text = content_type)) AS uploads,
      COALESCE(SUM(up.votes) FILTER (WHERE up.is_hidden = false AND (content_type IS NULL OR up.type::text = content_type)), 0) AS votes
    FROM users u
    LEFT JOIN uploads up ON u.id = up.user_id
    GROUP BY u.id
  ),
  user_badge_counts AS (
    SELECT
      ub.user_id,
      COUNT(ub.id) as badges
    FROM user_badges ub
    GROUP BY ub.user_id
  )
  SELECT
    us.id as user_id,
    us.name as user_name,
    us.username,
    us.uploads as total_uploads,
    us.votes as total_votes,
    COALESCE(ubc.badges, 0) as badge_count
  FROM user_stats us
  LEFT JOIN user_badge_counts ubc ON us.id = ubc.user_id
  WHERE us.uploads > 0
  ORDER BY us.votes DESC, us.uploads DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_referral_leaderboard(limit_count integer)
RETURNS TABLE(user_id uuid, user_name text, username text, referral_count bigint, total_uploads bigint, total_votes bigint)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as user_id,
    u.name as user_name,
    u.username,
    (SELECT COUNT(*) FROM referrals r WHERE r.referrer_id = u.id) as referral_count,
    u.total_uploads,
    u.total_votes
  FROM users u
  ORDER BY referral_count DESC, u.total_votes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
