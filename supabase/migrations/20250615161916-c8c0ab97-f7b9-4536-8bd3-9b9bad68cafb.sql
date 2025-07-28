
-- Update handle_new_user function to generate a unique username on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  unique_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Use name from metadata, fallback to email part before '@'
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'name',
    substring(NEW.email from '(.*)@')
  );
  -- Sanitize username: lowercase, replace spaces and invalid chars with underscore
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]+', '_', 'g'));
  
  -- If the sanitized username is empty, generate one from user's id
  IF base_username = '' THEN
    base_username := 'user_' || SUBSTRING(NEW.id::text, 1, 8);
  END IF;

  unique_username := base_username;
  
  -- Ensure username is unique by appending a counter if it already exists
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = unique_username) LOOP
    counter := counter + 1;
    unique_username := base_username || '_' || counter;
  END LOOP;

  INSERT INTO public.users (id, email, name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    unique_username
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
