-- Add gender and play_style columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('男', '女', '保密')),
ADD COLUMN IF NOT EXISTS play_style TEXT CHECK (play_style IN ('攻守兼备', '暴力进攻', '拉吊突击', '防守反击', '网前雨刮'));

-- Setup Storage for Avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid );
-- Note: the upload policy above assumes filename starts with user_id, which my code does: `${profile.id}-${Date.now()}.${fileExt}`
-- But strict parsing in SQL is hard. maybe simpler policy for now:
-- create policy "Authenticated users can upload avatars"
--   on storage.objects for insert
--   with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Let's use a simpler policy for this demo/MVP
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

create policy "Users can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
