import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://htoqucxdimyioymrwfow.supabase.co'
const supabaseKey = 'sb_publishable_SlAOuE3zoGCEiIS-VGrmZQ_MAjCJSoS'

export const supabase = createClient(supabaseUrl, supabaseKey)
