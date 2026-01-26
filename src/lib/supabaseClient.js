// Use the JS library to create a bucket.
import { createClient } from '@supabase/supabase-js';
const supabase= createClient('azzxcjxmbcpimyjgldgt',"sb_secret_wN58kJTLrvGlEIbC9QlC2Q_8sjrGWeU");
// const { data, error } = await supabase.storage.createBucket('avatars', {// default: false
// });
export default supabase;
