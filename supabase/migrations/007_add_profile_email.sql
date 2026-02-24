-- Add email column to profiles table so we can store it properly on signup.
alter table profiles add column if not exists email text;
