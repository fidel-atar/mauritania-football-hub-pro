
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iccqqpuxyeaamurhvbbv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3FxcHV4eWVhYW11cmh2YmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MzUyNDcsImV4cCI6MjA2NDMxMTI0N30.2EyrdcT-V8_Z4NHClZLHvtYNLr1tBEAdNnCC4MjiQc0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
