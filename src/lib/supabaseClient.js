// Use the JS library to create a bucket.
import { createClient } from '@supabase/supabase-js';
const supabase= createClient('");
// const { data, error } = await supabase.storage.createBucket('avatars', {// default: false
// });
export default supabase;
