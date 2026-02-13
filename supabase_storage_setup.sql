-- 1. Create the storage bucket
insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true)
on conflict (id) do nothing;

-- 2. access policies (read)
create policy "Give public access to business-images"
  on storage.objects for select
  using ( bucket_id = 'business-images' );

-- 3. write policies (insert) - allowing public uploads for this demo
create policy "Allow public uploads to business-images"
  on storage.objects for insert
  with check ( bucket_id = 'business-images' );

-- 4. update policies
create policy "Allow updates to business-images"
  on storage.objects for update
  using ( bucket_id = 'business-images' );

-- 5. delete policies
create policy "Allow deletes from business-images"
  on storage.objects for delete
  using ( bucket_id = 'business-images' );
