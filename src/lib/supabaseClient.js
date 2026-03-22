// Use the JS library to create a bucket.
import { createClient } from '@supabase/supabase-js';

const supabase= createClient(  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

);
// const { data, error } = await supabase.storage.createBucket('avatars', {// default: false
// });
export default supabase;
