
'use server'
 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
 
export async function login(prevState: string | undefined, formData: FormData) {
  const supabase = createClient()
 
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
 
  if (error) {
    return 'Could not authenticate user. Please check your credentials.'
  }
 
  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
